// Message
// Message component is a simple component that displays a message
// Like facebook messenger, it will display the message on the right if it is sent by the user and on the left if it is received from the other user
// It also has a tail that points to the user who sent the message
// If it is the first message from a MessageGroup, its tail will be pointing at bottom
// If it is the last message from a MessageGroup, its tail will be pointing at top
// if it is a message in the middle of a MessageGroup, it will have a straight tail
// If it is a single message, it will have a rounded tail
//
// export interface MessageDto {
//     id: string;
//     senderId: string;
//     senderName: string;
//     receiverId: string;
//     content: string;
//     timestamp: string;
// }

import React from 'react';
import { MessageDto } from '@/constants/types/chat-types';

interface MessageProps {
  message: MessageDto;
  isOwn: boolean; // Whether the message is sent by the current user
  position: 'first' | 'middle' | 'last' | 'single'; // Position in the message group
}

function Message({ message, isOwn, position }: MessageProps) {
  // Determine the appropriate CSS classes based on whether the message is own or not
  const containerClasses = `flex ${
    isOwn ? 'justify-end' : 'justify-start'
  } mb-1`;

  // Base message style
  let messageClasses = `max-w-[70%] px-3 py-2 rounded-xl ${
    isOwn ? 'bg-b200 text-white' : 'bg-gray-200 text-gray-800'
  }`;

  // Add appropriate border radius based on position
  if (position === 'first') {
    messageClasses += isOwn ? ' rounded-br-none' : ' rounded-bl-none';
  } else if (position === 'middle') {
    messageClasses += isOwn
      ? ' rounded-tr-none rounded-br-none'
      : ' rounded-tl-none rounded-bl-none';
  } else if (position === 'last') {
    messageClasses += isOwn ? ' rounded-tr-none' : ' rounded-tl-none';
  }

  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={containerClasses}>
      <div className={messageClasses}>
        <p>{message.content}</p>
        <div
          className={`mt-1 text-xs ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export default Message;
