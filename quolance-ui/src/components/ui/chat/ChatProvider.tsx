'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthGuard } from '@/api/auth-api';
import ChatContainer from '@/components/ui/chat/ChatContainer';
import {
  chatbotContact,
  ChatContactProps,
  ContactDto,
} from '@/constants/types/chat-types';
import ContactsContainer from '@/components/ui/chat/ContactsContainer';
import { useGetContacts, useSendMessage } from '@/api/chat-api';
import { useQueryClient } from '@tanstack/react-query';
import {
  createDraftContact,
  isBlacklistedPath,
  isMessageUnread,
  updateLastRead,
} from '@/util/chatUtils';
import { usePathname } from 'next/navigation';
import ChatIconMobile from '@/components/ui/chat/ChatIconMobile';
import useWindowDimensions from '@/util/hooks/useWindowDimensions';

type ChatContextType = {
  containers: ChatContactProps[];
  contacts: ContactDto[];
  isLoading: boolean;
  sendMessage: (receiverId: string, message: string, isDraft?: boolean) => void;
  onOpenChat: (contact: ContactDto) => void;
  onNewChat: (
    receiverId: string,
    name?: string,
    profileImageUrl?: string
  ) => void;
  onUserInteraction: (receiverId: string) => void;
  allMessagesRead: boolean;
  hideChatInterface: boolean;
  setHideChatInterface: (value: boolean) => void;
  removeContainer: (receiverId: string) => void;
  setMinimize: (receiverId: string, value: boolean) => void;
  setExpanded: (receiverId: string, value: boolean) => void;
  lastReadUpdate: number;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { isMobile } = useWindowDimensions();
  const { data: contacts = [], isLoading, isFetched } = useGetContacts(user);
  const { mutateAsync: sendMessageMutate } = useSendMessage();
  const queryClient = useQueryClient();
  const [hideChatInterface, setHideChatInterface] = useState(true);
  const [allMessagesRead, setAllMessagesRead] = useState(false);
  const [containers, setContainers] = useState<ChatContactProps[]>([]);
  const [lastReadUpdate, setLastReadUpdate] = useState(0);

  useEffect(() => {
    // Invalidate all containers when contacts change
    if (isFetched) {
      for (const container of containers) {
        queryClient.invalidateQueries({
          queryKey: ['messages', container.contact.user_id],
          refetchType: 'active',
        });
      }
    }
    // update all containers with the new contacts
    setContainers((prev) =>
      prev.map((container) => {
        const contact = contacts.find(
          (c) => c.user_id === container.contact.user_id
        );
        if (contact) {
          return { ...container, contact };
        }
        return container;
      })
    );
  }, [contacts]);

  useEffect(() => {
    setContainers([]);
    if (!user) {
      containerActions.add({
        contact: chatbotContact,
        onClose: () => containerActions.remove('chatbot'),
        isMinimized: true,
        isExpanded: false,
      });
    }
  }, [user]);

  useEffect(() => {
    if (contacts.length > 0) {
      const unreadMessages = contacts.some((contact) =>
        isMessageUnread(contact, user?.id || '')
      );
      setAllMessagesRead(!unreadMessages);
    }
  }, [contacts, lastReadUpdate]);

  const containerActions = {
    add: (container: ChatContactProps) =>
      setContainers((prev) =>
        prev.some((c) => c.contact.user_id === container.contact.user_id)
          ? prev
          : [...prev, container].slice(-3)
      ),
    remove: (receiverId: string) =>
      setContainers((prev) =>
        prev.filter((c) => c.contact.user_id !== receiverId)
      ),
    minimize: (receiverId: string, value: boolean) =>
      setContainers((prev) =>
        prev.map((c) =>
          c.contact.user_id === receiverId ? { ...c, isMinimized: value } : c
        )
      ),
    expand: (receiverId: string, value: boolean) =>
      setContainers((prev) =>
        prev.map((c) =>
          c.contact.user_id === receiverId ? { ...c, isExpanded: value } : c
        )
      ),
  };

  const onUserInteraction = (receiverId: string) => {
    updateLastRead(receiverId, new Date().toISOString());
    setLastReadUpdate(Date.now());
  };

  const onOpenChat = (contact: ContactDto) => {
    // If chat is already present in container just un-minimize it
    const existing = containers.find(
      (c) =>
        c.contact.user_id === contact.user_id &&
        !c.contact.name.startsWith('Draft')
    );
    if (existing) {
      containerActions.minimize(contact.user_id, false);
      return;
    }
    containerActions.add({
      contact,
      onClose: () => containerActions.remove(contact.user_id),
      isMinimized: true,
      isExpanded: false,
    });
    onUserInteraction(contact.user_id);
  };

  const sendMessage = (
    receiverId: string,
    message: string,
    isDraft = false
  ) => {
    sendMessageMutate({ receiver_id: receiverId, content: message }).then(
      () => {
        // Set as read after sending message
        onUserInteraction(receiverId);
        // If message is a draft, we need to remove the container
        // Fetch the contacts again to get the updated list
        // Then open the chat with the new contact
        if (isDraft) {
          containerActions.remove(receiverId);
          // Wait for the contacts query to refetch and complete
          queryClient
            .invalidateQueries({
              queryKey: ['contacts'],
              refetchType: 'active',
            })
            .then(() => queryClient.refetchQueries({ queryKey: ['contacts'] }))
            .then(() => {
              const updatedContacts =
                queryClient.getQueryData<ContactDto[]>(['contacts']) || [];
              onOpenChat(
                updatedContacts.find((c) => c.user_id === receiverId) ||
                  createDraftContact(receiverId)
              );
            });
        }
      }
    );
  };

  const onNewChat = (
    receiverId: string,
    name?: string,
    profilePictureUrl?: string
  ) => {
    isMobile && setHideChatInterface(false);
    const existing = containers.find((c) => c.contact.user_id === receiverId);
    if (existing) {
      // If chat already exists, minimize all other chats, and unminimize the chat
      setContainers((prev) =>
        prev.map((c) =>
          c.contact.user_id === receiverId
            ? { ...c, isMinimized: false }
            : { ...c, isMinimized: true }
        )
      );
      return;
    }
    // Then we check if it is already in the list of contacts
    const contact = contacts.find((c) => c.user_id === receiverId);
    if (contact) {
      onOpenChat(contact);
      return;
    }
    if (!existing) {
      containerActions.add({
        contact: createDraftContact(receiverId, name, profilePictureUrl),
        onClose: () => containerActions.remove(receiverId),
        isMinimized: true,
        isExpanded: false,
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        containers,
        contacts,
        isLoading,
        sendMessage,
        onOpenChat,
        onNewChat,
        onUserInteraction,
        hideChatInterface,
        setHideChatInterface,
        removeContainer: containerActions.remove,
        setMinimize: containerActions.minimize,
        setExpanded: containerActions.expand,
        allMessagesRead,
        lastReadUpdate,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function ChatInterface() {
  const context = useContext(ChatContext);
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { isMobile } = useWindowDimensions();
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const pathname = usePathname();

  if (!context)
    throw new Error('ChatInterface must be used within ChatProvider');
  const {
    containers,
    contacts,
    isLoading,
    onOpenChat,
    removeContainer,
    hideChatInterface,
    setHideChatInterface,
  } = context;

  useEffect(() => {
    setIsBlacklisted(isBlacklistedPath(pathname));
  }, [pathname]);

  useEffect(() => {
    if (!document) return;
    if (!hideChatInterface && isMobile) {
      document.body.classList.add('overflow-hidden', 'fixed', 'w-full');
    } else {
      document.body.classList.remove('overflow-hidden', 'fixed', 'w-full');
    }

    return () => {
      document.body.classList.remove('overflow-hidden', 'fixed', 'w-full');
    };
  }, [hideChatInterface, isMobile]);

  if (isLoading || isBlacklisted) return <></>;

  if (!user) {
    // If user is not logged in, show chatbot only. For now, we don't support
    return (
      // <div className='fixed bottom-0 right-4 z-[999] px-10'>
      //   {containers.length > 0 && <ChatContainer {...containers[0]} />}
      // </div>
      <></>
    );
  }

  return (
    <div className='fixed bottom-0 right-0 z-[999] sm:right-4 sm:px-10'>
      {/* Mobile Interface */}
      <div className='sm:hidden'>
        {hideChatInterface ? (
          <div className='relative bottom-3 right-4'>
            <ChatIconMobile onClick={() => setHideChatInterface(false)} />
          </div>
        ) : (
          <>
            {/* Mobile Chat Containers */}
            <div className='absolute bottom-0 right-0 z-20'>
              {containers.map((container) => (
                <ChatContainer key={container.contact.user_id} {...container} />
              ))}
            </div>

            {/* Mobile Contacts Container */}
            <div className='absolute bottom-0 right-0 z-10'>
              <ContactsContainer
                contacts={[chatbotContact, ...contacts]}
                onOpenChat={onOpenChat}
              />
            </div>
          </>
        )}
      </div>

      {/* Desktop Interface */}
      <div className='hidden sm:block'>
        <div className='relative right-[304px] flex flex-row gap-4'>
          {containers.map((container) => (
            <ChatContainer key={container.contact.user_id} {...container} />
          ))}
        </div>
        <div className='absolute bottom-0 right-10'>
          <ContactsContainer
            contacts={[chatbotContact, ...contacts]}
            onOpenChat={onOpenChat}
          />
        </div>
      </div>
    </div>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
