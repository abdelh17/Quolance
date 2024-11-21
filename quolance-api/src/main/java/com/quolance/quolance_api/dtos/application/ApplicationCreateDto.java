package com.quolance.quolance_api.dtos.application;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Application;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationCreateDto {

    @JsonProperty("projectId")
    private Long projectId;

    public static Application toEntity(ApplicationCreateDto applicationCreateDto) {
        return Application.builder()
                .build();
    }

}
