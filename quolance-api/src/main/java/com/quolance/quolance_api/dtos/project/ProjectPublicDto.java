package com.quolance.quolance_api.dtos.project;

import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectPublicDto {

    private UUID id;

    private String title;

    private String description;

    private LocalDate expirationDate;

    private ProjectCategory category;

    private PriceRange priceRange;

    private FreelancerExperienceLevel experienceLevel;

    private ExpectedDeliveryTime expectedDeliveryTime;

    private ProjectStatus projectStatus;

    private List<Tag> tags;

    private Boolean hasApplied;

    public static ProjectPublicDto fromEntity(Project project) {
        return ProjectPublicDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .expirationDate(project.getExpirationDate())
                .category(project.getCategory())
                .priceRange(project.getPriceRange())
                .experienceLevel(project.getExperienceLevel())
                .expectedDeliveryTime(project.getExpectedDeliveryTime())
                .projectStatus(project.getProjectStatus())
                .tags(project.getTags())
                .build();
    }
}
