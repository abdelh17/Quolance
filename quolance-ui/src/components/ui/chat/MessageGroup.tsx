import React from 'react';
import { MessageDto } from '@/constants/types/chat-types';
import Message from './Message';
import { useAuthGuard } from '@/api/auth-api';
import MessageTimestampSeparator from '@/components/ui/chat/MessageTimestampSeperator';

interface MessageGroupProps {
  messages: MessageDto[];
}

function MessageGroup({ messages }: MessageGroupProps) {
  const { user } = useAuthGuard({ middleware: 'auth' });

  if (!messages.length || !user) return null;
  const isOwn = messages[0].sender_id === user.id;

  const firstMessageTimestamp = messages[0].timestamp;

  return (
    <div
      className={`flex flex-col ${
        isOwn ? 'items-end' : 'items-start'
      } mb-4 last:mb-0`}
    >
      <MessageTimestampSeparator
        timestamp={firstMessageTimestamp}
        separatorColor={'bg-transparent'}
      />
      {messages.map((message, index) => {
        // Determine message position
        let position: 'first' | 'middle' | 'last' | 'single';

        if (messages.length === 1) {
          position = 'single';
        } else if (index === 0) {
          position = 'first';
        } else if (index === messages.length - 1) {
          position = 'last';
        } else {
          position = 'middle';
        }

        return (
          <Message
            key={message.id}
            message={message}
            isOwn={isOwn}
            position={position}
          />
        );
      })}

      {/* Sender name for received messages (optional) */}
      {/*{!isOwn && (*/}
      {/*  <span className='ml-2 mt-1 text-xs text-gray-500'>*/}
      {/*    {messages[0].sender_name}*/}
      {/*  </span>*/}
      {/*)}*/}
    </div>
  );
}

export default MessageGroup;
