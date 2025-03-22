package com.quolance.quolance_api.dtos.chat;

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
    private UUID userId;
    private String name;
    private String profilePicture;
    private String lastMessage;
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