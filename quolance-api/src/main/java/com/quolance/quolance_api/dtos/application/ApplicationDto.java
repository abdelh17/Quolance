package com.quolance.quolance_api.dtos.application;

import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDto {

    private Long id;

    private ApplicationStatus status;

    private Long projectId;

    private String projectTitle;

    private Long freelancerId;

    private FreelancerProfileDto freelancerProfile;

    public static ApplicationDto fromEntity(Application application) {
        return ApplicationDto.builder()
                .id(application.getId())
                .status(application.getApplicationStatus())
                .projectId(application.getProject() != null ? application.getProject().getId() : null)
                .projectTitle(application.getProject() != null ? application.getProject().getTitle() : null)
                .freelancerId(application.getFreelancer() != null ? application.getFreelancer().getId() : null)
                .freelancerProfile(FreelancerProfileDto.fromEntity(application.getFreelancer()))
                .build();
    }
}
