package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.business_workflow.ClientWorkflowService;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientWorkflowServiceImpl implements ClientWorkflowService {

    private final ProjectService projectService;
    private final ApplicationService applicationService;

    @Override
    public void createProject(ProjectCreateDto projectCreateDto, User client) {

        Project projectToSave = ProjectCreateDto.toEntity(projectCreateDto);
        projectToSave.setExpirationDate(projectCreateDto.getExpirationDate() != null ? projectCreateDto.getExpirationDate() : LocalDate.now().plusDays(7));
        projectToSave.setClient(client);
        projectService.saveProject(projectToSave);
    }

    @Override
    public ProjectDto getProject(Long projectId, User client) {
        Project project = projectService.getProjectById(projectId);
        return ProjectDto.fromEntity(project);
    }

    @Override
    public void deleteProject(Long projectId, User client) {
        Project project = projectService.getProjectById(projectId);

        if(!project.isOwnedBy(client.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to remove this project")
                    .build();
        }

        projectService.deleteProject(project);
    }

    @Override
    public List<ProjectDto> getAllClientProjects(User client) {
        List<Project> projects = projectService.getProjectsByClientId(client.getId());
        return projects.stream().map(ProjectDto::fromEntity).toList();
    }

    @Override
    public List<ApplicationDto> getAllApplicationsToProject(Long projectId, User client) {
        Project project = projectService.getProjectById(projectId);

        if(!project.isOwnedBy(client.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to view this project applications")
                    .build();
        }

        return applicationService.getAllApplicationsByProjectId(projectId).stream().map(ApplicationDto::fromEntity).toList();
    }
}
