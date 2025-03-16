import httpClient from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { PaginationParams, PaginationQueryDefault } from '@/constants/types/pagination-types';
import { showToast } from '@/util/context/ToastProvider';

// Types
export interface MessageDto {
    id: string;
    sender_id: string;
    sender_name: string;
    receiver_id: string;
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

// API Functions
export const sendMessage = async (messageData: SendMessageDto): Promise<MessageDto> => {
    const { data } = await httpClient.post<MessageDto>('/api/chat/send', messageData);
    return data;
};

export const getMessagesBetweenUsers = async (
    userId: string,
    params: PaginationParams = PaginationQueryDefault
): Promise<{ content: MessageDto[] }> => {
    const { data } = await httpClient.get<{ content: MessageDto[] }>(
        `/api/chat/messages/${userId}`,
        { params }
    );
    return data;
};

// Hooks
export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messageData: SendMessageDto) => sendMessage(messageData),
        onSuccess: (newMessage, variables) => {
            // Update the messages cache to include the new message
            queryClient.setQueryData<{ content: MessageDto[] }>(
                ['messages', variables.receiver_id],
                (oldData) => {
                    if (!oldData) return { content: [newMessage] };
                    return {
                        ...oldData,
                        content: [...oldData.content, newMessage]
                    };
                }
            );
        },
        onError: (error) => {
            showToast('Failed to send message', 'error');
            console.error('Error sending message:', error);
        }
    });
};

export const useMessages = (userId: string, params: PaginationParams = PaginationQueryDefault) => {
    return useQuery({
        queryKey: ['messages', userId, params],
        queryFn: () => getMessagesBetweenUsers(userId, params),
        enabled: !!userId,
    });
};

// Polling Hook
export const useChatPolling = (
    userId: string,
    options: {
        enabled?: boolean;
        interval?: number;
        onNewMessages?: (messages: MessageDto[]) => void;
    } = {}
) => {
    const {
        enabled = true,
        interval = 5000,
        onNewMessages
    } = options;

    const queryClient = useQueryClient();
    const [state, setState] = useState<ChatPollingState>({
        isPolling: false,
        lastMessageTimestamp: null
    });

    const intervalRef = useRef<number | null>(null);

    const fetchMessages = async () => {
        if (!userId || !enabled) return;

        try {
            const params: PaginationParams = {
                ...PaginationQueryDefault,
                sortBy: 'timestamp',
                sortDirection: 'DESC'
            };

            const response = await getMessagesBetweenUsers(userId, params);
            const messages = response.content;

            if (messages.length === 0) return;

            // On first fetch, just store timestamp
            if (!state.lastMessageTimestamp) {
                setState(prev => ({
                    ...prev,
                    lastMessageTimestamp: messages[0].timestamp
                }));
                return;
            }

            // Find new messages
            const newMessages = messages.filter(msg =>
                new Date(msg.timestamp).getTime() > new Date(state.lastMessageTimestamp!).getTime()
            );

            if (newMessages.length > 0) {
                // Update the last timestamp
                setState(prev => ({
                    ...prev,
                    lastMessageTimestamp: newMessages[0].timestamp
                }));

                // Sort by timestamp (oldest first)
                newMessages.sort((a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );

                // Update cache
                queryClient.setQueryData<{ content: MessageDto[] }>(
                    ['messages', userId],
                    (oldData) => {
                        if (!oldData) return { content: newMessages };

                        // Create a map of existing message IDs for quick lookup
                        const existingIds = new Set(oldData.content.map(msg => msg.id));

                        // Only add messages that don't already exist in the cache
                        const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));

                        return {
                            ...oldData,
                            content: [...oldData.content, ...uniqueNewMessages]
                        };
                    }
                );

                // Call the callback if provided
                if (onNewMessages) {
                    onNewMessages(newMessages);
                }
            }
        } catch (error) {
            console.error('Error polling for messages:', error);
        }
    };

    const startPolling = () => {
        if (intervalRef.current) {
            stopPolling();
        }

        // Initial fetch
        fetchMessages();

        // Start interval
        intervalRef.current = window.setInterval(fetchMessages, interval);
        setState(prev => ({ ...prev, isPolling: true }));
    };

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setState(prev => ({ ...prev, isPolling: false }));
        }
    };

    // Start/stop polling based on enabled prop
    useEffect(() => {
        if (enabled && userId) {
            startPolling();
        } else {
            stopPolling();
        }

        return () => {
            stopPolling();
        };
    }, [userId, enabled, interval]);

    return {
        isPolling: state.isPolling,
        startPolling,
        stopPolling
    };
};
