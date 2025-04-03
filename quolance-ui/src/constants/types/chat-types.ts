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

export interface ContactDto {
  user_id: string;
  name: string;
  profile_picture: string;
  last_message: string;
  last_message_timestamp: string;
  last_sender_id: string;
}

export interface ChatContactProps {
  contact: ContactDto;
  onClose: () => void;
  isMinimized: boolean;
  isExpanded: boolean;
}

export type ChatContextType = {
  containers: ChatContactProps[];
  contacts: ContactDto[];
  isLoading: boolean;
  sendMessage: (receiverId: string, message: string, isDraft?: boolean) => void;
  onOpenChat: (contact: ContactDto) => void;
  onNewChat: (
    receiverId: string,
    name?: string,
    profileImageUrl?: string
  ) => void;
  removeContainer: (receiverId: string) => void;
  setMinimize: (receiverId: string, value: boolean) => void;
  setExpanded: (receiverId: string, value: boolean) => void;
  lastReadUpdate: number;
};
export const chatbotContact: ContactDto = {
  user_id: 'chatbot',
  name: 'Chatbot',
  profile_picture: 'chatbot',
  last_message: 'Hello how can I help you?',
  last_message_timestamp: '',
  last_sender_id: 'chatbot',
};
