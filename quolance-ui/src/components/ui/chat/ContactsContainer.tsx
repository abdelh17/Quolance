import React from 'react';
import ContactsHeader from '@/components/ui/chat/ContactsHeader';
import { useAuthGuard } from '@/api/auth-api';
import GenericChatContainer from '@/components/ui/chat/GenericChatContainer';
import { ContactDto } from '@/constants/types/chat-types';
import ChatContact from '@/components/ui/chat/ChatContact';
import conversation_illustration from '@/public/images/conversation_illustration.png';
import Image from 'next/image';
import Link from 'next/link';
import { Role } from '@/models/user/UserResponse';

interface ContactsContainerProps {
  contacts: ContactDto[];
  onOpenChat: (contact: ContactDto) => void;
}

function ContactsContainer({ contacts, onOpenChat }: ContactsContainerProps) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const [isMinimized, setIsMinimized] = React.useState(true);
  const width = 320;
  const height = 696;

  return (
    <div className='mt-auto w-72 '>
      <ContactsHeader
        avatar={user?.profileImageUrl || ''}
        title={'Messaging'}
        width={width}
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized((prevState) => !prevState)}
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
    <div className='flex h-full w-full flex-col'>
      <div className='flex-1 overflow-hidden'>
        {contacts.length > 1 && user?.role === Role.CLIENT && (
          <div className={'flex h-fit w-full py-3'}>
            <Link
              className='mx-12 w-full flex-1 rounded-full border-2 p-2 text-center hover:bg-gray-100'
              href={'/candidates'}
            >
              Browse candidates
            </Link>
          </div>
        )}
        <div className='h-fit divide-y divide-slate-200 overflow-y-auto bg-white'>
          {contacts.map((contact, index) => (
            <ChatContact
              contact={contact}
              onClick={onOpenChat}
              key={`contact-${index}`}
            />
          ))}
        </div>

        {contacts.length == 1 && (
          <div className='border-t border-t-slate-200 pt-10'>
            <Image src={conversation_illustration} alt={'conversation image'} />
            <div className='flex flex-col gap-3 p-3 pb-16 text-center'>
              <h2 className='text-lg font-semibold text-slate-800'>
                No conversations yet
              </h2>
              <p className='text-center text-gray-600'>
                You will see all your conversations here.
              </p>
              {user?.role && (
                <Link
                  className='mx-2 mt-4 rounded-full border-2 p-2 hover:bg-gray-100'
                  href={user.role === Role.CLIENT ? '/candidates' : '/profile'}
                >
                  {user.role === Role.CLIENT
                    ? 'Browse candidates'
                    : 'Build Profile'}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsContainer;
