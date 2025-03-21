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
        avatar={''} // TODO: Change this to the actual avatar
        title={'John Doe'} // TODO: Change this to the actual name
        width={width}
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized((prevState) => !prevState)}
        onNewChat={onOpenChat}
      />
      <GenericChatContainer
        isMinimized={isMinimized}
        minWidth={width}
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
  return (
    <div className={'h-full w-full'}>
      <div className={'bg-white'}>
        {contacts.length == 0 ? (
          <div></div>
        ) : (
          <div className={'flex w-full flex-col divide-y divide-slate-200'}>
            {contacts.map((contact, index) => (
              <>
                <ChatContact
                  contact={contact}
                  onClick={onOpenChat}
                  key={index}
                />
              </>
            ))}
          </div>
        )}

        {/*<Button*/}
        {/*  onClick={onNewChat}*/}
        {/*  className={*/}
        {/*    'w-full rounded-none bg-slate-50 text-slate-900 drop-shadow-sm hover:bg-slate-100'*/}
        {/*  }*/}
        {/*  icon={<TbEdit />}*/}
        {/*>*/}
        {/*  Start New Chat*/}
        {/*</Button>*/}
      </div>
    </div>
  );
}

export default ContactsContainer;
