import React from 'react';
import { MessageDto } from '@/constants/types/chat-types';

interface MessageProps {
  message: MessageDto;
  isOwn: boolean;
  position: 'first' | 'middle' | 'last' | 'single';
}

function Message({ message, isOwn, position }: MessageProps) {
  const containerClasses = `flex ${
    isOwn ? 'justify-end' : 'justify-start'
  } mb-[2px] w-full`;

  let messageClasses = `max-w-[70%] px-3 py-2 rounded-3xl ${
    isOwn ? 'bg-b200 text-white' : 'bg-gray-200 text-gray-800'
  } flex flex-col`;

  if (position === 'first') {
    messageClasses += isOwn ? ' rounded-br-lg' : ' rounded-bl-lg';
  } else if (position === 'middle') {
    messageClasses += isOwn ? ' rounded-r-lg' : ' rounded-l-lg';
  } else if (position === 'last') {
    messageClasses += isOwn ? ' rounded-tr-lg' : ' rounded-tl-lg';
  } else if (position === 'single') {
    messageClasses += isOwn ? ' rounded-r-3xl' : ' rounded-l-3xl';
  }
  return (
    <div className={containerClasses}>
      <div className={messageClasses}>
        <p className='whitespace-pre-wrap break-words'>{message.content}</p>
      </div>
    </div>
  );
}
export default Message;
