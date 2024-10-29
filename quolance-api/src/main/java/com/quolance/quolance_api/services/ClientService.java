package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;

import java.util.List;

public interface ClientService {
    ProjectDto createProject(ProjectDto projectDto);

    List<ProjectDto> getMyProjects(Long clientId);

    List<ApplicationDto> getApplicationsToMyProject(Long projectId);
}
