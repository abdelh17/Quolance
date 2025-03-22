// ChatHeader
// The header displayed in the chatcontainer
// Has the avatar and name of the outgoing user
// Contains the close button
// Contains the minimize button
// Contains an enlarge button
// If visible, Clicking on the component will minimize the chat container
// If minimized, clicking on the component will show the chat container
// Like linkedin, the chat container will be minimized by default

import React from 'react';
import GenericChatHeader from '@/components/ui/chat/GenericChatHeader';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { useAuthGuard } from '@/api/auth-api';
import { CgClose } from 'react-icons/cg';
import { ContactDto } from '@/constants/types/chat-types';

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

  return (
    <GenericChatHeader
      avatar={profile_picture}
      title={name}
      width={width}
      buttons={[
        {
          icon: isExpanded ? <FaCompressAlt /> : <FaExpandAlt />,
          onClick: onExpand,
          isVisible: !isMinimized,
        },
        {
          icon: <CgClose strokeWidth={2} strokeLinecap={'round'} />,
          onClick: onClose,
          isVisible: !(name === 'Chatbot' && !user), // We don't want to show the close button for the chatbot
        },
      ]}
      onMinimize={onMinimize}
    />
  );
}

export default ChatHeader;
