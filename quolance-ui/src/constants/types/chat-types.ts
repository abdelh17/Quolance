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

export const chatbotContact: ContactDto = {
  user_id: 'chatbot',
  name: 'Chatbot',
  profile_picture: 'chatbot',
  last_message: 'Hello how can I help you?',
  last_message_timestamp: '',
  last_sender_id: 'chatbot',
};
