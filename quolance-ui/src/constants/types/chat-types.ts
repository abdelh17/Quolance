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