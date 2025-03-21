'use client';
// Chat controller component
// Will contain the chat container, conversation container and new chat container
// Controls which container is displayed at the left of conversation container
// Will also control the visibility of the chat container
// Will also control the visibility of the new chat container

import React, { useEffect } from 'react';
import { useAuthGuard } from '@/api/auth-api';
import ChatContainer from '@/components/ui/chat/ChatContainer';
import { ChatContactProps, ContactDto } from '@/constants/types/chat-types';
import ContactsContainer from '@/components/ui/chat/ContactsContainer';
import { useGetContacts } from '@/api/chat-api';

const chatbotContact: ContactDto = {
  user_id: 'chatbot',
  name: 'Chatbot',
  profile_picture: 'chatbot',
  last_message:
    'Hello my name is Chatbot, how can I help you? Or do you want to chat?',
  last_message_timestamp: '',
  unread_messages: 0,
};

function ChatController() {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [containers, setContainers] = React.useState<ChatContactProps[]>([]);
  const { data: contacts, isLoading } = useGetContacts(user);

  useEffect(() => {
    setContainers([]);

    // Only add the chatbot container for logged-out users
    if (!user) {
      addContainer({
        contact: chatbotContact,
        onClose: () => removeContainer('chatbot'),
      });
    }
  }, [user]);

  const addContainer = (container: ChatContactProps) => {
    setContainers((prevContainers) => {
      // Prevent duplicates
      if (
        prevContainers.some(
          (c) => c.contact.user_id === container.contact.user_id
        )
      ) {
        return prevContainers;
      }

      // Maintain maximum 3 containers with proper ordering
      const newContainers = [...prevContainers, container];
      return newContainers.slice(-3);
    });
  };

  const removeContainer = (receiverId: string) => {
    setContainers((prevContainers) =>
      prevContainers.filter(
        (container) => container.contact.user_id !== receiverId
      )
    );
  };

  const onNewChat = (contact: ContactDto) => {
    addContainer({
      contact,
      onClose: () => removeContainer(contact.user_id),
    });
  };

  if (isLoading) {
    return <></>;
  }

  if (!user) {
    // We do not show conversations, instead we show only the chat container with a chatbot
    return (
      <div className={'fixed bottom-0 right-0 z-[999] px-10'}>
        {containers.length > 0 && <ChatContainer {...containers[0]} />}
      </div>
    );
  }

  return (
    <div className={'fixed bottom-0 right-0 z-[999] px-10'}>
      <div className={'flex flex-row gap-4'}>
        {containers.map((container) => (
          <ChatContainer key={container.contact.user_id} {...container} />
        ))}
        <ContactsContainer contacts={contacts || []} onOpenChat={onNewChat} />
      </div>
    </div>
  );
}

export default ChatController;
