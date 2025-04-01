import httpClient from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/util/context/ToastProvider';
import {
  ContactDto,
  MessageDto,
  SendMessageDto,
} from '@/constants/types/chat-types';
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse';
import { UserResponse } from '@/models/user/UserResponse';

// API Functions
export const sendMessage = async (
  messageData: SendMessageDto
): Promise<MessageDto> => {
  const { data } = await httpClient.post<MessageDto>(
    '/api/chat/send',
    messageData
  );
  return data;
};

export const getMessagesBetweenUsers = async (
  userId: string
): Promise<MessageDto[]> => {
  const { data } = await httpClient.get<MessageDto[]>(
    `/api/chat/messages/${userId}`
  );
  return data;
};

export const getContacts = async () => {
  const { data } = await httpClient.get<ContactDto[]>('/api/chat/contacts');
  return data;
};

// Hooks
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<MessageDto, HttpErrorResponse, SendMessageDto>({
    mutationFn: (messageData: SendMessageDto) => sendMessage(messageData),
    onSuccess: (newMessage, variables) => {
      // Update the messages cache to include the new message
      queryClient.setQueryData<MessageDto[]>(
        ['messages', variables.receiver_id],
        (oldData) => {
          if (!oldData) return [newMessage];
          return [...oldData, newMessage];
        }
      );
    },
    onError: (error) => {
      showToast(
        `Failed to send message: ${error.message || 'Unknown error'}`,
        'error'
      );
      console.error('Error sending message:', error);
    },
  });
};

interface ChatbotResponse {
  message: string;
}

export const useSendChatbotMessage = () => {
  return useMutation({
    mutationFn: async (userMessage: string): Promise<ChatbotResponse> => {
      const response = await httpClient.post<string>('/api/chat', {
        message: userMessage,
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const responseText = response.data;

      return {
        message: responseText,
      };
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error';
      showToast(`Error: ${errorMessage}`, 'error');
    },
  });
};

export const useGetMessages = (userId: string, enabled = true) => {
  return useQuery<MessageDto[], HttpErrorResponse>({
    queryKey: ['messages', userId],
    queryFn: () => getMessagesBetweenUsers(userId),
    enabled: !!userId && userId !== 'chatbot' && enabled,
  });
};

export const useGetContacts = (user: UserResponse | undefined) => {
  return useQuery<ContactDto[], HttpErrorResponse>({
    queryKey: ['contacts'],
    enabled: !!user,
    queryFn: getContacts,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
