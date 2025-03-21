// ConversationHeader
// This component is used to display the header of the ConversationContainer.
// It displays the avatar of the logged in user.
// like the ChatHeader, it can be minimized/showed by clicking on it.
// There is a chevron down icon that will minimize the conversation container.
// there is an edit icon that will open the new chat modal, replacing the ChatContainer with the new chat modal.

import GenericChatHeader from '@/components/ui/chat/GenericChatHeader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ContactDto } from '@/constants/types/chat-types';

interface ConversationHeaderProps {
  avatar: string;
  title: string;
  width: number;
  isMinimized: boolean;
  onMinimize: () => void;
  onNewChat: (contact: ContactDto) => void;
}

function ContactsHeader({
  avatar,
  title,
  width,
  isMinimized,
  onMinimize,
}: ConversationHeaderProps) {
  return (
    <GenericChatHeader
      title={title}
      avatar={avatar}
      width={width}
      onMinimize={onMinimize}
      buttons={[
        {
          icon: isMinimized ? <FaChevronUp /> : <FaChevronDown />,
          onClick: onMinimize,
          isVisible: true,
        },
      ]}
    />
  );
}

export default ContactsHeader;
