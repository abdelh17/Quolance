import React, { useEffect, useRef, useState } from 'react';
import Avatar from '@/components/ui/chat/Avatar';
import { ContactDto } from '@/constants/types/chat-types';
import { getFirstName } from '@/util/stringUtils';
import { formatTimeForChat, isMessageUnread } from '@/util/chatUtils';
import { useChat } from '@/components/ui/chat/ChatProvider';
import { useAuthGuard } from '@/api/auth-api';

interface ContactProps {
  contact: ContactDto;
  onClick: (contact: ContactDto) => void;
}

function ChatContact({ contact, onClick }: ContactProps) {
  const {
    name,
    profile_picture,
    last_message,
    last_message_timestamp,
    last_sender_id,
  } = contact;
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [hasTwoLines, setHasTwoLines] = useState(false);
  const [isUnread, setIsUnread] = useState(false);
  const { lastReadUpdate } = useChat();
  const { user } = useAuthGuard({ middleware: 'auth' });
  const isOwn = last_sender_id === user?.id; // TODO: check if this is correct

  useEffect(() => {
    if (lastMessageRef.current) {
      const element = lastMessageRef.current;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const lines = element.clientHeight / lineHeight;
      setHasTwoLines(lines > 1);
    }
  }, [last_message]);

  useEffect(() => {
    setIsUnread(isMessageUnread(contact, user?.id || ''));
  }, [contact, lastReadUpdate]);

  return (
    <div
      className='flex h-[80px] cursor-pointer items-stretch p-3 hover:bg-slate-100'
      onClick={() => onClick(contact)}
    >
      <Avatar size='md' src={profile_picture} className={'my-auto'} />
      <div
        className={`ml-2 ${
          hasTwoLines ? 'mt-0' : 'mt-2'
        } flex flex-grow flex-col overflow-hidden`}
      >
        <div className='text-sm font-semibold text-slate-800'>{name}</div>
        <div
          ref={lastMessageRef}
          className='line-clamp-2 overflow-ellipsis text-xs font-[100] text-slate-500'
        >
          {isOwn ? 'You' : getFirstName(name)}: {last_message}
        </div>
      </div>
      <div className='ml-auto flex flex-col justify-between'>
        <div className='line-clamp-1 whitespace-nowrap text-sm text-gray-500'>
          {formatTimeForChat(last_message_timestamp)}
        </div>
        {isUnread && (
          <div className='bg-b400 mb-1 ml-auto mr-1 flex h-[10px] w-[10px] items-center justify-center rounded-full' />
        )}
      </div>
    </div>
  );
}

export default ChatContact;
