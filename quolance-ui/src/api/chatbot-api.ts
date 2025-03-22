import {useMutation} from '@tanstack/react-query';

import httpClient from '@/lib/httpClient';

import {showToast} from '@/util/context/ToastProvider';

interface ChatbotResponse {
    message: string;
}

export const useSendMessage = () => {
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
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            showToast(`Error: ${errorMessage}`, 'error');
        },
    });
};