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
@NoArgsConstructor
@AllArgsConstructor
public class ContactDto {
    @JsonProperty("user_id")
    private UUID userId;

    @JsonProperty("name")
    private String name;

    @JsonProperty("profile_picture")
    private String profilePicture;

    @JsonProperty("last_message")
    private String lastMessage;

    @JsonProperty("last_message_timestamp")
    private LocalDateTime lastMessageTimestamp;

    public static ContactDto fromUserAndMessage(User user, Message lastMessage) {
        return ContactDto.builder()
                .userId(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .profilePicture(user.getProfileImageUrl())
                .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                .lastMessageTimestamp(lastMessage != null ? lastMessage.getTimestamp() : null)
                .build();
    }
}