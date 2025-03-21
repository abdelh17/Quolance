'use client';
// Chat container component
// will contain the conversation header, chat messages and chat input

import React, { useEffect } from 'react';
import { useAuthGuard } from '@/api/auth-api';
import { ChatContactProps, MessageDto } from '@/constants/types/chat-types';
import ChatHeader from '@/components/ui/chat/ChatHeader';
import GenericChatContainer from '@/components/ui/chat/GenericChatContainer';
import { useGetMessages, useSendMessage } from '@/api/chat-api';
import ChatInput from '@/components/ui/chat/ChatInput';
import MessageList from '@/components/ui/chat/MessageList';
import { useChat } from '@/components/ui/chat/ChatProvider';

const ChatContainer: React.FC<ChatContactProps> = ({
  contact,
  onClose,
  isMinimized,
  isExpanded,
}) => {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { user_id: receiverId, profile_picture, name } = contact;
  const { setMinimize, setExpanded } = useChat();
  const [isClosing, setIsClosing] = React.useState(false);
  const width = isMinimized ? 230 : isExpanded ? 500 : 336;
  const height = isExpanded ? 696 : 400;

  const { data: messages } = useGetMessages(receiverId);

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
        avatar={profile_picture}
        width={width}
        title={name}
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
          receiverId={receiverId}
          messages={messages || []}
          isMinimized={isMinimized}
        />
      </GenericChatContainer>
    </div>
  );
};

const ChatContent: React.FC<{
  receiverId: string;
  messages: MessageDto[];
  isMinimized: boolean;
}> = ({ receiverId, messages, isMinimized }) => {
  const { mutate: sendMessage } = useSendMessage();
  const [inputValue, setInputValue] = React.useState('');
  const [chatInputExpanded, setChatInputExpanded] = React.useState(false);

  const handleSendMessage = () => {
    if (!inputValue) return;
    sendMessage({ content: inputValue, receiver_id: receiverId });
    setInputValue('');
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto'>
        <MessageList messages={messages} isMinimized={isMinimized} />
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
