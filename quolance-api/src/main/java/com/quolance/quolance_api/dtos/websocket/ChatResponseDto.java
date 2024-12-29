package com.quolance.quolance_api.dtos.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ChatResponseDto {
    private String chatMessage;
    private String sender;
    private LocalDateTime timestamp;

    public static ChatResponseDto from(String chatMessage, String sender, LocalDateTime timestamp) {
        return ChatResponseDto.builder()
                .chatMessage(chatMessage)
                .sender(sender)
                .timestamp(timestamp)
                .build();
    }
}
