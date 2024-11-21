package com.quolance.quolance_api.dtos.project;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDto {


    private Long id;

    private String title;

    private String description;

    private LocalDate expirationDate;

    private LocalDate visibilityExpirationDate;

    private ProjectCategory category;

    private PriceRange priceRange;

    private FreelancerExperienceLevel experienceLevel;

    private ExpectedDeliveryTime expectedDeliveryTime;

    private ProjectStatus projectStatus;

    private List<Tag> tags;

    private Long clientId;

    private Long selectedFreelancerId;

    private List<ApplicationDto> applications;

    public static ProjectDto fromEntity(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .expirationDate(project.getExpirationDate())
                .visibilityExpirationDate(project.getVisibilityExpirationDate())
                .category(project.getCategory())
                .priceRange(project.getPriceRange())
                .experienceLevel(project.getExperienceLevel())
                .expectedDeliveryTime(project.getExpectedDeliveryTime())
                .projectStatus(project.getProjectStatus())
                .tags(project.getTags())
                .clientId(project.getClient() != null ? project.getClient().getId() : null)
                .selectedFreelancerId(project.getSelectedFreelancer() != null ? project.getSelectedFreelancer().getId() : null)
                .applications(project.getApplications() != null ? project.getApplications().stream()
                        .map(ApplicationDto::fromEntity)
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
