'use client';
// Chat controller component
// Will contain the chat container, conversation container and new chat container
// Controls which container is displayed at the left of conversation container
// Will also control the visibility of the chat container
// Will also control the visibility of the new chat container

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthGuard } from '@/api/auth-api';
import ChatContainer from '@/components/ui/chat/ChatContainer';
import { ChatContactProps, ContactDto } from '@/constants/types/chat-types';
import ContactsContainer from '@/components/ui/chat/ContactsContainer';
import { useGetContacts, useSendMessage } from '@/api/chat-api';
import { useQueryClient } from '@tanstack/react-query';
import { updateLastRead } from '@/util/chatUtils';

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
  removeContainer: (receiverId: string) => void;
  setMinimize: (receiverId: string, value: boolean) => void;
  setExpanded: (receiverId: string, value: boolean) => void;
  lastReadUpdate: number;
};

const ChatContext = createContext<ChatContextType | null>(null);

const chatbotContact: ContactDto = {
  user_id: 'chatbot',
  name: 'Chatbot',
  profile_picture: 'chatbot',
  last_message: 'Hello how can I help you?',
  last_message_timestamp: '',
};

const createDraftContact = (
  receiverId: string,
  name?: string,
  profilePictureUrl?: string
): ContactDto => ({
  user_id: receiverId,
  name: `Draft: ${name || receiverId}`,
  profile_picture: profilePictureUrl || '',
  last_message: '',
  last_message_timestamp: '',
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { data: contacts = [], isLoading, isFetched } = useGetContacts(user);
  const { mutateAsync: sendMessageMutate } = useSendMessage();
  const queryClient = useQueryClient();
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
  }, [contacts]);

  const onUserInteraction = (receiverId: string) => {
    updateLastRead(receiverId, new Date().toISOString());
    setLastReadUpdate(Date.now());
  };

  const addContainer = (container: ChatContactProps) => {
    setContainers((prev) => {
      if (prev.some((c) => c.contact.user_id === container.contact.user_id)) {
        return prev;
      }
      return [...prev, container].slice(-3);
    });
  };

  const removeContainer = (receiverId: string) => {
    setContainers((prev) =>
      prev.filter((c) => c.contact.user_id !== receiverId)
    );
  };

  const setMinimize = (receiverId: string, value: boolean) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.contact.user_id === receiverId ? { ...c, isMinimized: value } : c
      )
    );
    onUserInteraction(receiverId);
  };

  const setExpanded = (receiverId: string, value: boolean) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.contact.user_id === receiverId ? { ...c, isExpanded: value } : c
      )
    );
    onUserInteraction(receiverId);
  };

  const onOpenChat = (contact: ContactDto) => {
    // If chat is already present in container just un-minimize it
    const existing = containers.find(
      (c) => c.contact.user_id === contact.user_id
    );
    if (existing) {
      setMinimize(contact.user_id, false);
      return;
    }
    addContainer({
      contact,
      onClose: () => removeContainer(contact.user_id),
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
          removeContainer(receiverId);
          queryClient
            .invalidateQueries({
              queryKey: ['contacts'],
              refetchType: 'active',
            })
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
      addContainer({
        contact: createDraftContact(receiverId, name, profilePictureUrl),
        onClose: () => removeContainer(receiverId),
        isMinimized: true,
        isExpanded: false,
      });
    }
  };

  useEffect(() => {
    setContainers([]);
    if (!user) {
      addContainer({
        contact: chatbotContact,
        onClose: () => removeContainer('chatbot'),
        isMinimized: true,
        isExpanded: false,
      });
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        containers,
        contacts,
        isLoading,
        sendMessage,
        onOpenChat,
        onNewChat,
        removeContainer,
        setMinimize,
        setExpanded,
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
  if (!context)
    throw new Error('ChatInterface must be used within ChatProvider');

  const { containers, contacts, isLoading, onOpenChat, removeContainer } =
    context;

  if (isLoading) return <></>;

  if (!user) {
    // If user is not logged in, show chatbot only
    return (
      <div className='fixed bottom-0 right-0 z-[999] px-10'>
        {containers.length > 0 && <ChatContainer {...containers[0]} />}
      </div>
    );
  }

  return (
    <div className='fixed bottom-0 right-0 z-[999] px-10'>
      <div className='flex flex-row gap-4'>
        {containers.map((container) => (
          <ChatContainer key={container.contact.user_id} {...container} />
        ))}
        <ContactsContainer
          contacts={[chatbotContact, ...contacts]}
          onOpenChat={onOpenChat}
        />
      </div>
    </div>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
