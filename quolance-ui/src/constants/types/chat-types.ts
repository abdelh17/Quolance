export interface MessageDto {
  id: string;
  sender_id: string;
  sender_name: string;
  receiver_name: string;
  content: string;
  timestamp: string;
}

export interface SendMessageDto {
  receiver_id: string;
  content: string;
}

export interface ChatPollingState {
  isPolling: boolean;
  lastMessageTimestamp: string | null;
}

export interface ContactDto {
  user_id: string;
  name: string;
  profile_picture: string;
  last_message: string;
  last_message_timestamp: string;
  unread_messages: number;
}

export interface ChatContactProps {
  contact: ContactDto;
  onClose: () => void;
}
