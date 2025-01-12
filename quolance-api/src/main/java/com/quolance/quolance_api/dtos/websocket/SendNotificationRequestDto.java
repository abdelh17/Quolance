package com.quolance.quolance_api.dtos.websocket;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class SendNotificationRequestDto {

    @JsonProperty("message")
    @NotBlank(message = "The notification message is required")
    private String message;

    @JsonProperty("recipient_ids")
    @NotEmpty(message = "At least one recipient ID is required")
    private List<Long> recipientIds;
}
