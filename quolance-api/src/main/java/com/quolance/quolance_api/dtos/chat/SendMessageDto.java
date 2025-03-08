package com.quolance.quolance_api.dtos.chat;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SendMessageDto {

    @JsonProperty("receiver_id")
    @NotNull(message = "Receiver ID is required")
    private UUID receiverId;

    @JsonProperty("content")
    @NotBlank(message = "Message content is required")
    private String content;
}