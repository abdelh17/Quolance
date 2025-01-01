package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.business_workflow.ClientWorkflowService;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientWorkflowServiceImpl implements ClientWorkflowService {

    private final ProjectService projectService;
    private final ApplicationService applicationService;
    private final UserService userService;

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
    public Page<ProjectDto> getAllClientProjects(User client, Pageable pageable) {
        Page<Project> projectPage = projectService.getProjectsByClientId(client.getId(), pageable);
        return projectPage.map(ProjectDto::fromEntity); // Map entities to DTOs
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

    @Override
    public ProjectDto updateProject(Long projectId, ProjectUpdateDto projectUpdateDto, User client) {
        Project existingProject = projectService.getProjectById(projectId);

        if (!existingProject.isOwnedBy(client.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You don't have permission to update this project")
                    .build();
        }

        projectService.updateProject(existingProject, projectUpdateDto);

        return ProjectDto.fromEntity(existingProject);
    }

    @Override
    public FreelancerProfileDto getFreelancerProfile(Long freelancerId) {
        Optional<User> freelancer = userService.findById(freelancerId);

        if (freelancer.isPresent()) {
            return FreelancerProfileDto.fromEntity(freelancer.get());
        } else {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("Freelancer not found")
                    .build();
        }
    }

}
