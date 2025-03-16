import httpClient from '@/lib/httpClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { showToast } from '@/util/context/ToastProvider';
import { MessageDto, SendMessageDto, ChatPollingState } from '@/constants/types/chat-types';
import { HttpErrorResponse } from '@/constants/models/http/HttpErrorResponse';

// API Functions
export const sendMessage = async (messageData: SendMessageDto): Promise<MessageDto> => {
    const { data } = await httpClient.post<MessageDto>('/api/chat/send', messageData);
    return data;
};

export const getMessagesBetweenUsers = async (userId: string): Promise<MessageDto[]> => {
    const { data } = await httpClient.get<MessageDto[]>(`/api/chat/messages/${userId}`);
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
                ['messages', variables.receiverId],
                (oldData) => {
                    if (!oldData) return [newMessage];
                    return [...oldData, newMessage];
                }
            );
        },
        onError: (error) => {
            showToast(`Failed to send message: ${error.message || 'Unknown error'}`, 'error');
            console.error('Error sending message:', error);
        }
    });
};

export const useMessages = (userId: string) => {
    return useQuery<MessageDto[], HttpErrorResponse>({
        queryKey: ['messages', userId],
        queryFn: () => getMessagesBetweenUsers(userId),
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
            const messages = await getMessagesBetweenUsers(userId);

            if (messages.length === 0) return;

            // Sort messages by timestamp (newest first) to find the latest message
            const sortedMessages = [...messages].sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            // On first fetch, just store timestamp
            if (!state.lastMessageTimestamp) {
                setState(prev => ({
                    ...prev,
                    lastMessageTimestamp: sortedMessages[0].timestamp
                }));
                return;
            }

            // Find new messages
            const newMessages = messages.filter(msg => {
                const msgTime = new Date(msg.timestamp).getTime();
                const lastTime = new Date(state.lastMessageTimestamp!).getTime();
                return msgTime > lastTime;
            });

            if (newMessages.length > 0) {
                // Update the last timestamp (use the newest message's timestamp)
                const newestMessage = newMessages.reduce((newest, msg) => {
                    return new Date(msg.timestamp).getTime() > new Date(newest.timestamp).getTime() ? msg : newest;
                }, newMessages[0]);

                setState(prev => ({
                    ...prev,
                    lastMessageTimestamp: newestMessage.timestamp
                }));

                // Sort by timestamp (oldest first)
                newMessages.sort((a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );

                // Update cache
                queryClient.setQueryData<MessageDto[]>(
                    ['messages', userId],
                    (oldData) => {
                        if (!oldData) return newMessages;

                        // Create a map of existing message IDs for quick lookup
                        const existingIds = new Set(oldData.map(msg => msg.id));

                        // Only add messages that don't already exist in the cache
                        const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));

                        return [...oldData, ...uniqueNewMessages];
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