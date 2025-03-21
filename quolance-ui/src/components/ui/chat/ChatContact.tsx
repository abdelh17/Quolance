// Conversation
// A conversation is a component that shows prior messages between two users.
// It displays the outgoing name
// It simply displays the last message either from the user or the other user.
// This component, although his name sounds a bit misleading, is a component that will be contained in the ConversationContainer,
// On click, it will open the conversation between the two users, updating the ChatContainer with the onClicked conversation.
// optionally we can send the last activity time to the right of the conversation
// optionally we can send the number of unread messages to the right of the conversation as a red notification badge

import React from 'react';
import Avatar from '@/components/ui/chat/Avatar';
import { ContactDto } from '@/constants/types/chat-types';
import { formatTimeForChat, getFirstName } from '@/util/stringUtils';

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
    unread_messages,
  } = contact;
  return (
    <>
      <div
        className='flex h-[80px] cursor-pointer items-stretch p-3 hover:bg-slate-200'
        onClick={() => onClick(contact)}
      >
        <Avatar size='md' src={profile_picture} className={'my-auto'} />
        <div className='ml-4 flex flex-grow flex-col overflow-hidden'>
          <div className='text-sm font-semibold text-slate-800'>{name}</div>
          <div className='mt-1 line-clamp-2 overflow-ellipsis text-xs font-[100] text-slate-500'>
            {getFirstName(name)}:{last_message}
          </div>
        </div>
        <div className='ml-auto flex flex-col justify-between'>
          <div className='line-clamp-1 whitespace-nowrap text-sm text-gray-500'>
            {formatTimeForChat(last_message_timestamp)}
          </div>
          {unread_messages > 0 && (
            <div className='bg-b400 mb-1 ml-auto mr-1 flex h-4 w-4 items-center justify-center rounded-full text-[11px] text-white'>
              {unread_messages}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatContact;
