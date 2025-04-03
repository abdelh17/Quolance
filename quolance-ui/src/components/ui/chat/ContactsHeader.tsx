import GenericChatHeader from '@/components/ui/chat/GenericChatHeader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import useWindowDimensions from '@/util/hooks/useWindowDimensions';
import { CgClose } from 'react-icons/cg';
import { useChat } from '@/components/ui/chat/ChatProvider';

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
  const { allMessagesRead } = useChat();

  return (
    <GenericChatHeader
      title={title}
      avatar={avatar}
      width={width}
      onMinimize={onMinimize}
      isUnread={!allMessagesRead}
      buttons={[
        {
          icon: isMinimized ? <FaChevronUp /> : <FaChevronDown />,
          onClick: onMinimize,
          isVisible: !isMobile,
        },
        {
          icon: <CgClose strokeWidth={1.8} strokeLinecap={'round'} />,
          onClick: onHideChat,
          isVisible: isMobile,
        },
      ]}
    />
  );
}

export default ContactsHeader;
