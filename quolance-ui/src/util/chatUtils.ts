import { ContactDto, MessageDto } from '@/constants/types/chat-types';
import { format, isThisYear, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { isMobileWidth } from '@/util/utils';

const GROUPING_THRESHOLD = 300000; // 5 minutes
const LAST_READ_KEY = 'chatLastReadTimestamps';

export function groupMessages(messages: MessageDto[]): MessageDto[][] {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const groups: MessageDto[][] = [];
  let currentGroup: MessageDto[] = [];

  for (const message of sortedMessages) {
    if (currentGroup.length === 0) {
      currentGroup.push(message);
    } else {
      const lastMessage = currentGroup[currentGroup.length - 1];
      // We check if sameSender by check previous message senderId with current message senderId
      const sameSender = lastMessage.sender_id === message.sender_id;

      const timeDifference =
        new Date(message.timestamp).getTime() -
        new Date(lastMessage.timestamp).getTime();

      if (sameSender && timeDifference <= GROUPING_THRESHOLD) {
        currentGroup.push(message);
      } else {
        groups.push(currentGroup);
        currentGroup = [message];
      }
    }
  }

  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}

export const formatTimeForChat = (date: string) => {
  // Parse the timestamp
  if (!date) return '';
  const timestamp = new Date(date);
  const now = new Date();

  // Calculate time difference in milliseconds
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // Less than 2 minutes, show "Just now"
  if (diffMinutes < 2) {
    return 'Just now';
  }

  // Check if it's within 24 hours
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    // Format as "xx:xx AM/PM"
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Check if it's within 48 hours (yesterday)
  if (diffHours < 48) {
    return 'Yesterday';
  }

  // More than 48 hours, show "Month Day" (short month name)
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatTimestampString = (timestamp: string) => {
  const date = new Date(timestamp);
  let formattedDate = '';

  if (isToday(date)) {
    formattedDate = format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    formattedDate = `Yesterday, ${format(date, 'h:mm a')}`;
  } else if (isThisYear(date)) {
    formattedDate = format(date, 'd MMM, h:mm a', { locale: fr });
  } else {
    formattedDate = format(date, 'dd/MM/yyyy HH:mm');
  }

  return formattedDate;
};

export const updateLastRead = (receiverId: string, timestamp: string) => {
  const timestamps = getLastReadTimestamps();
  timestamps[receiverId] = timestamp;
  localStorage.setItem(LAST_READ_KEY, JSON.stringify(timestamps));
};

export const getLastReadTimestamps = (): Record<string, string> => {
  return JSON.parse(localStorage.getItem(LAST_READ_KEY) || '{}');
};

export const isMessageUnread = (
  contact: ContactDto,
  self_id: string
): boolean => {
  if (contact.user_id == 'chatbot' || contact.name.startsWith('Draft: '))
    return false;
  if (contact.last_sender_id == self_id) return false;

  const lastRead = getLastReadTimestamps()[contact.user_id];
  if (!lastRead) return true;

  const lastReadDate = new Date(lastRead);
  const lastMessageDate = new Date(contact.last_message_timestamp);

  // Check if dates are valid
  if (isNaN(lastReadDate.getTime()) || isNaN(lastMessageDate.getTime())) {
    return true;
  }

  const lastReadSeconds = Math.floor(lastReadDate.getTime() / 1000);
  const lastMessageSeconds = Math.floor(lastMessageDate.getTime() / 1000);

  return lastMessageSeconds > lastReadSeconds;
};

export const getHeightFromWindowsDimensions = (
  type: 'chat' | 'contacts',
  windowWidth: number,
  windowHeight: number
) => {
  const isMobile = isMobileWidth(windowWidth);

  if (type === 'chat') {
    if (isMobile) {
      return windowHeight - 56;
    }
    return Math.floor(windowHeight * 0.34) - 56;
  }
  return isMobile ? windowHeight - 56 : Math.floor(windowHeight * 0.65) - 56;
};

export const createDraftContact = (
  receiverId: string,
  name?: string,
  profilePictureUrl?: string
): ContactDto => ({
  user_id: receiverId,
  name: `Draft: ${name || receiverId}`,
  profile_picture: profilePictureUrl || '',
  last_message: '',
  last_message_timestamp: '',
  last_sender_id: '',
});

// Add URL to the blacklist to hide the chat interface
export const BLACKLISTED_PATHS = [
  '/auth/',
  '/profile',
  '/how-it-works',
  '/support',
  '/why-quolance',
  '/not-found',
  '/post-project',
  '/setting',
];

export const isBlacklistedPath = (path: string) => {
  return BLACKLISTED_PATHS.some(
    (p) =>
      path.startsWith(p) || path.replace(/\/$/, '') === p.replace(/\/$/, '')
  );
};
