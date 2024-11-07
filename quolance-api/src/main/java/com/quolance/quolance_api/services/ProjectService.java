package com.quolance.quolance_api.services;


import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.dtos.RejectProjectRequestDto;
import com.quolance.quolance_api.entities.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectService {
    ProjectDto createProject(Project project);
    List<ProjectDto> getProjectsByClientId(Long clientId);
    List<ProjectDto> getAllProjects();
    ProjectDto getProjectById(Long id);
    Optional<Project> getProjectEntityById(Long id);

    List<ApplicationDto> getApplicationsToProject(Long projectId);

    ProjectDto approveProject(Long projectId);

    ProjectDto rejectProject(RejectProjectRequestDto rejectProjectRequestDto);
}
