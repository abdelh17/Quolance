package com.quolance.quolance_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.Tag;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ProjectDto {

    @JsonProperty("projectId")
    private Long id;

    @JsonProperty("projectDescription")
    @NotBlank(message = "The description is required")
    private String description;

    @JsonProperty("clientId")
    private Long clientId;

    private List<Tag> tags;

    public static Project toEntity(ProjectDto projectDto) {
        return Project.builder()
                .description(projectDto.getDescription())
                .tags(projectDto.getTags())
                .build();
    }

    public static ProjectDto fromEntity(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .description(project.getDescription())
                .clientId(project.getClient().getId())
                .tags(project.getTags())
                .build();
    }
}
