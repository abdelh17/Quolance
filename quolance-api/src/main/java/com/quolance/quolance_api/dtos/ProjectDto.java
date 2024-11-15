package com.quolance.quolance_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.*;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProjectDto {

    @JsonProperty("projectId")
    private Long id;

    @JsonProperty("createdDate")
    private LocalDateTime creationDate;

    @JsonProperty("projectCategory")
    @NotBlank(message = "The category is required")
    private ProjectCategory category;

    @JsonProperty("projectTitle")
    @NotBlank(message = "The title is required")
    private String title;

    @JsonProperty("projectDescription")
    @NotBlank(message = "The description is required")
    private String description;

    @JsonProperty("priceRange")
    private PriceRange priceRange;

    @JsonProperty("experienceLevel")
    private FreelancerExperienceLevel experienceLevel;

    @JsonProperty("expectedDeliveryTime")
    private ExpectedDeliveryTime expectedDeliveryTime;

    @JsonProperty("deliveryDate")
    private LocalDate deliveryDate;

    @JsonProperty("projectExpirationDate")
    private LocalDate expirationDate;

    @JsonProperty("location")
    private String location;

    @JsonProperty("projectStatus")
    private ProjectStatus projectStatus;

    @JsonProperty("clientId")
    private Long clientId;

    private List<Tag> tags;

    public static Project toEntity(ProjectDto projectDto) {
        return Project.builder()
                .category(projectDto.getCategory())
                .title(projectDto.getTitle())
                .description(projectDto.getDescription())
                .priceRange(projectDto.getPriceRange())
                .experienceLevel(projectDto.getExperienceLevel())
                .expectedDeliveryTime(projectDto.getExpectedDeliveryTime())
                .deliveryDate(projectDto.getDeliveryDate())
                .location(projectDto.getLocation())
                .tags(projectDto.getTags())
                .build();
    }

    public static ProjectDto fromEntity(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .creationDate(project.getCreationDate())
                .projectStatus(project.getProjectStatus())
                .category(project.getCategory())
                .title(project.getTitle())
                .description(project.getDescription())
                .priceRange(project.getPriceRange())
                .experienceLevel(project.getExperienceLevel())
                .expectedDeliveryTime(project.getExpectedDeliveryTime())
                .deliveryDate(project.getDeliveryDate())
                .location(project.getLocation())
                .clientId(project.getClient().getId())
                .tags(project.getTags())
                .build();
    }
}
