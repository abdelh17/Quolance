import React from 'react';
import Image, { StaticImageData } from 'next/image';
import FreelancerDefaultAvatar from '@/public/images/freelancer_default_icon.png';
import chatbotIcon from '@/public/images/chatbot_icon.png';

interface AvatarProps {
  className?: string;
  src?: string;
  size: 'sm' | 'md' | 'lg';
}

function Avatar({ className, src, size }: AvatarProps) {
  // Size mapping using object lookup instead of nested ternaries
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const avatarSize = sizeClasses[size] || sizeClasses.lg;

  let imageSrc: string | StaticImageData = FreelancerDefaultAvatar;
  if (src === 'chatbot') {
    imageSrc = chatbotIcon;
  } else if (src && src !== 'new') {
    imageSrc = src;
  }

  // If the src is 'new', we want to hide the avatar but keep the vertical space
  const visibilityClass = src === 'new' ? 'invisible w-0' : '';

  return (
    <Image
      src={imageSrc}
      alt='avatar'
      className={`rounded-full ${avatarSize} ${
        className || ''
      } ${visibilityClass}`}
    />
  );
}
export default Avatar;
