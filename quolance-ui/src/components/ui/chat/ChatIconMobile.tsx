import React, { useState } from 'react';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';

interface CircularChatIconProps {
  onClick: () => void;
}

const ChatIconMobile = ({ onClick }: CircularChatIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg transition-all duration-300 ${
        isHovered ? 'scale-110 shadow-xl' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label='Open chat'
    >
      <IoChatboxEllipsesOutline className='text-white' size={24} />
    </button>
  );
};

export default ChatIconMobile;
