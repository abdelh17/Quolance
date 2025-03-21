// ConversationContainer

// Contains a list of conversations of the user.
// It will show up when the user clicks the chat icon on the bottom right of the screen.
// Must be hidden by default.

import React from 'react';
import ContactsHeader from '@/components/ui/chat/ContactsHeader';
import { useAuthGuard } from '@/api/auth-api';
import GenericChatContainer from '@/components/ui/chat/GenericChatContainer';
import { ContactDto } from '@/constants/types/chat-types';
import ChatContact from '@/components/ui/chat/ChatContact';
import conversation_illustration from '@/public/images/conversation_illustration.png';
import Image from 'next/image';
import Link from 'next/link';
import { Role } from '@/constants/models/user/UserResponse';

interface ContactsContainerProps {
  contacts: ContactDto[];
  onOpenChat: (contact: ContactDto) => void;
}

function ContactsContainer({ contacts, onOpenChat }: ContactsContainerProps) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [isMinimized, setIsMinimized] = React.useState(true);
  const width = 288;
  const height = 867;

  return (
    <div className={`mt-auto w-min w-[${width}]`}>
      <ContactsHeader
        avatar={user?.profileImageUrl || ''}
        title={'Messaging'}
        width={width}
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized((prevState) => !prevState)}
        onNewChat={onOpenChat}
      />
      <GenericChatContainer
        isMinimized={isMinimized}
        width={width}
        height={height}
      >
        <ContactsContent onOpenChat={onOpenChat} contacts={contacts} />
      </GenericChatContainer>
    </div>
  );
}

function ContactsContent({
  contacts,
  onOpenChat,
}: {
  contacts: ContactDto[];
  onOpenChat: (contact: ContactDto) => void;
}) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  return (
    <div className={'h-full w-full'}>
      <div className={'border-b border-slate-200 bg-white'}>
        {contacts.length == 0 ? (
          <div className={'pt-10'}>
            <Image src={conversation_illustration} alt={'conversation image'} />
            <div className={'flex flex-col gap-3 p-3 pb-16 text-center'}>
              <h2 className={'text-lg font-semibold text-slate-800'}>
                No conversations yet
              </h2>
              <p className={'text-center text-gray-600'}>
                You will see all your conversations here.
              </p>
              {user?.role && (
                <Link
                  className={
                    'mx-2 mt-4 rounded-full border-2 p-2 hover:bg-gray-100'
                  }
                  href={user.role === Role.CLIENT ? '/candidates' : '/profile'}
                >
                  {user.role === Role.CLIENT
                    ? 'Browse candidates'
                    : 'Build Profile'}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className={'flex w-full flex-col divide-y divide-slate-200'}>
            {contacts.map((contact, index) => (
              <ChatContact contact={contact} onClick={onOpenChat} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsContainer;
