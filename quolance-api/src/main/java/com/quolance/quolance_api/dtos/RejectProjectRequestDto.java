package com.quolance.quolance_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RejectProjectRequestDto {
    @JsonProperty("projectId")
    private Long projectId;
    @JsonProperty("message")
    private String message;
}
