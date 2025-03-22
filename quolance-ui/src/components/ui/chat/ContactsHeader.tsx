import GenericChatHeader from '@/components/ui/chat/GenericChatHeader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ConversationHeaderProps {
  avatar: string;
  title: string;
  width: number;
  isMinimized: boolean;
  onMinimize: () => void;
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
