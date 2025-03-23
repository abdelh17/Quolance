'use client';

import React, { useEffect } from 'react';
import { useAuthGuard } from '@/api/auth-api';
import {
  ChatContactProps,
  ContactDto,
  MessageDto,
} from '@/constants/types/chat-types';
import ChatHeader from '@/components/ui/chat/ChatHeader';
import GenericChatContainer from '@/components/ui/chat/GenericChatContainer';
import { useGetMessages, useSendChatbotMessage } from '@/api/chat-api';
import ChatInput from '@/components/ui/chat/ChatInput';
import MessageList from '@/components/ui/chat/MessageList';
import { useChat } from '@/components/ui/chat/ChatProvider';
import ChatUserCard from '@/components/ui/chat/ChatUserCard';

const ChatContainer: React.FC<ChatContactProps> = ({
  contact,
  onClose,
  isMinimized,
  isExpanded,
}) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { user_id: receiverId } = contact;
  const { data: messages } = useGetMessages(receiverId, !isMinimized);
  const { setMinimize, setExpanded } = useChat();
  const [isClosing, setIsClosing] = React.useState(false);
  const width = isMinimized ? 230 : isExpanded ? 500 : 336;
  const height = isExpanded ? 696 : 400;

  const setIsMinimized = (value: boolean) => {
    setMinimize(receiverId, value);
  };

  const setIsExpanded = (value: boolean) => {
    setExpanded(receiverId, value);
  };

  // Animate the chat container when it is first mounted
  useEffect(() => {
    setIsMinimized(false);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsMinimized(true);
      setIsExpanded(false);
    }
  }, [user]);

  return (
    <div
      className={`mt-auto w-min w-[${width}] transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <ChatHeader
        contact={contact}
        width={width}
        isMinimized={isMinimized}
        isExpanded={isExpanded}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onExpand={() => setIsExpanded(!isExpanded)}
        onClose={() => {
          setIsMinimized(true);
          setIsClosing(true);
          setTimeout(onClose, isMinimized ? 100 : 230);
        }}
      />
      <GenericChatContainer
        isMinimized={isMinimized}
        width={width}
        height={height}
      >
        <ChatContent
          contact={contact}
          messages={messages || []}
          isMinimized={isMinimized}
        />
      </GenericChatContainer>
    </div>
  );
};

const ChatContent: React.FC<{
  contact: ContactDto;
  messages: MessageDto[];
  isMinimized: boolean;
}> = ({ contact, messages, isMinimized }) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { user_id: receiverId, profile_picture, name } = contact;
  const { sendMessage } = useChat();
  const [inputValue, setInputValue] = React.useState('');
  const { mutateAsync: sendChatbotMessage } = useSendChatbotMessage();
  const [chatInputExpanded, setChatInputExpanded] = React.useState(false);
  const isDraft = name.startsWith('Draft: ');
  const isChatbot = name === 'Chatbot';
  const [botMessages, setBotMessages] = React.useState<MessageDto[]>([]);

  const handleSendMessage = () => {
    if (!inputValue) return;
    if (isChatbot) {
      handleChatbotMessage();
      setInputValue('');
      return;
    }
    sendMessage(receiverId, inputValue, isDraft);
    setInputValue('');
  };

  const createMessage = (name: string, content: string, isOwn: boolean) => {
    return {
      id: `message-${messages.length}`,
      sender_id: isOwn ? user?.id || '' : 'chatbot',
      sender_name: name,
      receiver_name: isOwn ? name : 'Chatbot',
      content: content,
      timestamp: new Date().toISOString(),
    };
  };

  const handleChatbotMessage = () => {
    // Add the user message to the chat
    setBotMessages((prev) => [...prev, createMessage(name, inputValue, true)]);
    // Add the chatbot response to the chat
    sendChatbotMessage(inputValue).then(({ message }) => {
      setBotMessages((prev) => [
        ...prev,
        createMessage('Chatbot', message, false),
      ]);
    });
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto'>
        <MessageList
          messages={isChatbot ? botMessages : messages}
          isMinimized={isMinimized}
          chatUserCard={
            <ChatUserCard
              name={isDraft ? name.slice(7) : name}
              profile_picture={profile_picture}
              description={
                isDraft
                  ? 'Draft'
                  : isChatbot
                  ? 'Hello! I am Chatbot, your virtual assistant. Ask me anything!'
                  : ''
              }
            />
          }
        />
      </div>
      <ChatInput
        onSubmit={handleSendMessage}
        value={inputValue}
        onChange={setInputValue}
        expanded={chatInputExpanded}
        setExpanded={setChatInputExpanded}
      />
    </div>
  );
};

export default ChatContainer;
