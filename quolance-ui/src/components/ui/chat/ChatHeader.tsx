import React, { useEffect } from 'react';
import GenericChatHeader from '@/components/ui/chat/GenericChatHeader';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { useAuthGuard } from '@/api/auth-api';
import { CgClose } from 'react-icons/cg';
import { ContactDto } from '@/constants/types/chat-types';
import useWindowDimensions from '@/util/hooks/useWindowDimensions';
import { isMessageUnread } from '@/util/chatUtils';
import { useChat } from '@/components/ui/chat/ChatProvider';

interface ChatHeaderProps {
  contact: ContactDto;
  width: number;
  isMinimized: boolean;
  isExpanded: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onClose: () => void;
}

function ChatHeader({
  contact,
  width,
  isMinimized,
  isExpanded,
  onMinimize,
  onExpand,
  onClose,
}: ChatHeaderProps) {
  const { user } = useAuthGuard({ middleware: 'auth' });
  const { name, profile_picture } = contact;
  const { isMobile } = useWindowDimensions();
  const [isUnread, setIsUnread] = React.useState(false);
  const { lastReadUpdate, contacts, containers } = useChat();

  useEffect(() => {
    setIsUnread(isMessageUnread(contact, user?.id || ''));
  }, [contacts, lastReadUpdate, containers]);

  return (
    <GenericChatHeader
      avatar={profile_picture}
      title={name}
      width={width}
      isUnread={isUnread}
      buttons={[
        {
          icon: isExpanded ? <FaCompressAlt /> : <FaExpandAlt />,
          onClick: onExpand,
          isVisible: !isMinimized && !isMobile,
        },
        {
          icon: <CgClose strokeWidth={1.8} strokeLinecap={'round'} />,
          onClick: onClose,
          isVisible: !(name === 'Chatbot' && !user), // We don't want to show the close button for the chatbot
        },
      ]}
      onMinimize={onMinimize}
    />
  );
}

export default ChatHeader;
