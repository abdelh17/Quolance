package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.ClientService;
import com.quolance.quolance_api.services.ProjectService;
import com.quolance.quolance_api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ProjectService projectService;
    private final ApplicationService applicationService;

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
    public List<ApplicationDto> getApplicationsToMyProject(Long projectId) {
        List<ApplicationDto> applications = applicationService.getApplicationsByProjectId(projectId);
        return applications;
    }
}
