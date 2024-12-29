package com.quolance.quolance_api.dtos.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class GreetingResponseDto {
    private String message;
    private String sender;

    public static GreetingResponseDto from(String message, String sender) {
        return GreetingResponseDto.builder()
                .message(message)
                .sender(sender)
                .build();
    }
}
