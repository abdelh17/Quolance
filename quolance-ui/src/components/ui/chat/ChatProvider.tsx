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
import { useGetContacts } from '@/api/chat-api';

type ChatContextType = {
  containers: ChatContactProps[];
  contacts: ContactDto[];
  isLoading: boolean;
  onOpenChat: (contact: ContactDto) => void;
  onNewChat: (receiverId: string) => void;
  removeContainer: (receiverId: string) => void;
  setMinimize: (receiverId: string, value: boolean) => void;
  setExpanded: (receiverId: string, value: boolean) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

const chatbotContact: ContactDto = {
  user_id: 'chatbot',
  name: 'Chatbot',
  profile_picture: 'chatbot',
  last_message: 'Hello how can I help you?',
  last_message_timestamp: '',
  unread_messages: 0,
};

const createDraftContact = (receiverId: string): ContactDto => ({
  user_id: receiverId,
  name: 'New Chat',
  profile_picture: '',
  last_message: '',
  last_message_timestamp: '',
  unread_messages: 0,
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [containers, setContainers] = useState<ChatContactProps[]>([]);
  const { data: contacts = [], isLoading } = useGetContacts(user);

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

  const onOpenChat = (contact: ContactDto) => {
    addContainer({
      contact,
      onClose: () => removeContainer(contact.user_id),
      isMinimized: true,
      isExpanded: false,
    });
  };

  const setMinimize = (receiverId: string, value: boolean) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.contact.user_id === receiverId ? { ...c, isMinimized: value } : c
      )
    );
  };

  const setExpanded = (receiverId: string, value: boolean) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.contact.user_id === receiverId ? { ...c, isExpanded: value } : c
      )
    );
  };

  const onNewChat = (receiverId: string) => {
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
    // then we check if it is already in the list of contacts
    const contact = contacts.find((c) => c.user_id === receiverId);
    if (contact) {
      onOpenChat(contact);
      return;
    }
    if (!existing) {
      addContainer({
        contact: createDraftContact(receiverId),
        onClose: () => removeContainer(receiverId),
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
        onOpenChat,
        onNewChat,
        removeContainer,
        setMinimize,
        setExpanded,
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
    // If user is not logged in, show chatbot
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
