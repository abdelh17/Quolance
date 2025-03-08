package com.quolance.quolance_api.dtos.chat;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Message;
import com.quolance.quolance_api.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    @JsonProperty("id")
    private UUID id;

    @JsonProperty("sender_id")
    private UUID senderId;

    @JsonProperty("sender_name")
    private String senderName;

    @JsonProperty("receiver_id")
    private UUID receiverId;

    @JsonProperty("content")
    private String content;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    public static MessageDto fromEntity(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .receiverId(message.getReceiver().getId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}