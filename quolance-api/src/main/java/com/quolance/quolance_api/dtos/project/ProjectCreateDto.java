package com.quolance.quolance_api.dtos.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProjectCreateDto {

    @JsonProperty("projectTitle")
    @NotBlank(message = "The title is required")
    private String title;

    @JsonProperty("projectDescription")
    @NotBlank(message = "The description is required")
    private String description;

    @JsonProperty("projectExpirationDate")
    private LocalDate expirationDate;

    @JsonProperty("projectCategory")
    @NotBlank(message = "The category is required")
    private ProjectCategory category;

    @JsonProperty("priceRange")
    @NotBlank(message = "The price range is required")
    private PriceRange priceRange;

    @JsonProperty("experienceLevel")
    @NotBlank(message = "The experience level is required")
    private FreelancerExperienceLevel experienceLevel;

    @JsonProperty("expectedDeliveryTime")
    @NotBlank(message = "The expected is required")
    private ExpectedDeliveryTime expectedDeliveryTime;

    @JsonProperty("tags")
    private List<Tag> tags;

    public static Project toEntity(ProjectCreateDto projectCreateDto) {
        return Project.builder()
                .title(projectCreateDto.getTitle())
                .description(projectCreateDto.getDescription())
                .expirationDate(projectCreateDto.getExpirationDate())
                .category(projectCreateDto.getCategory())
                .priceRange(projectCreateDto.getPriceRange())
                .experienceLevel(projectCreateDto.getExperienceLevel())
                .expectedDeliveryTime(projectCreateDto.getExpectedDeliveryTime())
                // .tags(projectCreateDto.getTags())
                .build();
    }
}
