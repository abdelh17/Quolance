package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.User;

import java.util.List;

public interface ClientService {
    ProjectDto createProject(ProjectDto projectDto, User client);

    List<ProjectDto> getProjectsByClientId(Long clientId);

    List<ApplicationDto> getApplicationsByProjectId(Long projectId, Long clientId);
}
