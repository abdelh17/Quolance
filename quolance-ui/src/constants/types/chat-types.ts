export interface MessageDto {
    id: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    content: string;
    timestamp: string;
}

export interface SendMessageDto {
    receiverId: string;
    content: string;
}

export interface ChatPollingState {
    isPolling: boolean;
    lastMessageTimestamp: string | null;
}