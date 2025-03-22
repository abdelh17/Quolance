import React from 'react';
import Avatar from '@/components/ui/chat/Avatar';

interface ChatUserCardProps {
  name: string;
  profile_picture: string;
  description?: string;
}

function ChatUserCard({
  name,
  profile_picture,
  description,
}: ChatUserCardProps) {
  return (
    <div className={'flex w-full flex-col items-center gap-2 py-6'}>
      <Avatar size={'lg'} src={profile_picture} />
      <h1 className={'mt-2 text-lg font-semibold text-slate-800'}>{name}</h1>
      <p className={'text-slate-500'}>{description}</p>
    </div>
  );
}

export default ChatUserCard;
