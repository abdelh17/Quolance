import React from 'react';
import Image from 'next/image';
import FreelancerDefaultAvatar from '@/public/images/freelancer_default_icon.png';
import chatbotIcon from '@/public/images/chatbot_icon.png';

interface AvatarProps {
  className?: string;
  src?: string;
  size: 'sm' | 'md' | 'lg';
}

function Avatar({ className, src, size }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const dimensions = {
    sm: 36,
    md: 48,
    lg: 64,
  };

  const imageSrc =
    src === 'chatbot' ? chatbotIcon : src || FreelancerDefaultAvatar;

  return (
    <Image
      src={imageSrc}
      alt='avatar'
      className={`rounded-full ${sizeClasses[size] || sizeClasses.lg} ${
        className || ''
      }`}
      width={dimensions[size] || dimensions.lg}
      height={dimensions[size] || dimensions.lg}
    />
  );
}

export default Avatar;
