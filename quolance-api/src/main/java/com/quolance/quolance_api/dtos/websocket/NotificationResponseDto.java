package com.quolance.quolance_api.dtos.websocket;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.dtos.users.UserDto;
import com.quolance.quolance_api.entities.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class NotificationResponseDto {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("message")
    private String message;

    @JsonProperty("read")
    private boolean read;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    @JsonProperty("sender")
    private UserDto sender;

    @JsonProperty("recipient")
    private UserDto recipient;

    public static NotificationResponseDto fromEntity(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .read(notification.isRead())
                .timestamp(notification.getTimestamp())
                .sender(UserDto.fromEntity(notification.getSender()))
                .recipient(UserDto.fromEntity(notification.getRecipient()))
                .build();
    }

    public static NotificationResponseDto from(String message, LocalDateTime timestamp) {
        return NotificationResponseDto.builder()
                .message(message)
                .timestamp(timestamp)
                .build();
    }
}
