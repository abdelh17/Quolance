package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ClientService;
import com.quolance.quolance_api.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ProjectService projectService;

    @Override
    public ProjectDto createProject(ProjectDto projectDto, User client) {
        Project projectToSave = ProjectDto.toEntity(projectDto);
        projectToSave.setClient(client);
        ProjectDto savedProject = projectService.createProject(projectToSave);
        return savedProject;
    }

    @Override
    public List<ProjectDto> getProjectsByClientId(Long clientId) {
        List<ProjectDto> projects = projectService.getProjectsByClientId(clientId);
        return projects;
    }

    @Override
    public List<ApplicationDto> getApplicationsByProjectId(Long projectId, Long clientId) {
        List<ProjectDto> clientProjects = getProjectsByClientId(clientId);
        for (ProjectDto project : clientProjects) {
            if (project.getId().equals(projectId)) {
                return projectService.getApplicationsToProject(projectId);
            }
        }
        return List.of();
    }
}
