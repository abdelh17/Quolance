package com.quolance.quolance_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ApplicationDto {
    @JsonProperty("applicationId")
    private Long id;

    @JsonProperty("applicationStatus")
    @NotNull(message = "The status is required")
    private ApplicationStatus status;

    @JsonProperty("projectId")
    private Long projectId;

    @JsonProperty("freelancerId")
    private Long freelancerId;

    public static Application toEntity(ApplicationDto applicationDto) {
        return Application.builder()
                .status(applicationDto.getStatus())
                .build();
    }

    public static ApplicationDto fromEntity(Application application) {
        return ApplicationDto.builder()
                .id(application.getId())
                .status(application.getStatus())
                .projectId(application.getProject() != null ? application.getProject().getId() : null)
                .freelancerId(application.getFreelancer() != null ? application.getFreelancer().getId() : null)
                .build();
    }
}
