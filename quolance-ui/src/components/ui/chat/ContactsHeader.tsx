import GenericChatHeader from '@/components/ui/chat/GenericChatHeader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import useWindowDimensions from '@/util/hooks/useWindowDimensions';
import { CgClose } from 'react-icons/cg';

interface ConversationHeaderProps {
  avatar: string;
  title: string;
  width: number;
  isMinimized: boolean;
  onMinimize: () => void;
  onHideChat: () => void;
}

function ContactsHeader({
  avatar,
  title,
  width,
  isMinimized,
  onMinimize,
  onHideChat,
}: ConversationHeaderProps) {
  const { isMobile } = useWindowDimensions();
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
          isVisible: !isMobile,
        },
        {
          icon: <CgClose />,
          onClick: onHideChat,
          isVisible: false,
        },
      ]}
    />
  );
}

export default ContactsHeader;
