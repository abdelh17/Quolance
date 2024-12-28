package com.quolance.quolance_api.dtos.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class NotificationResponseDto {
    private String notificationMessage;
    private LocalDateTime timestamp;

    public static NotificationResponseDto from(String notificationMessage, LocalDateTime timestamp) {
        return NotificationResponseDto.builder()
                .notificationMessage(notificationMessage)
                .timestamp(timestamp)
                .build();
    }
}
