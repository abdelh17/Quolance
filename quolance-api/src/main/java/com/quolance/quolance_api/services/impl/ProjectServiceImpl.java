package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.dtos.RejectProjectRequestDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;

    @Override
    public ProjectDto createProject(Project project) {

        Project savedProject = projectRepository.save(project);
        return ProjectDto.fromEntity(savedProject);
    }

    @Override
    public List<ProjectDto> getProjectsByClientId(Long clientId) {
        List<Project> projects = projectRepository.findAllByClientId(clientId);
        return projects.stream().map(ProjectDto::fromEntity).toList();

    }

    @Override
    public List<ProjectDto> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream().map(ProjectDto::fromEntity).toList();
    }

    @Override
    public ProjectDto getProjectById(Long projectId) {
        Project project = getProjectEntityById(projectId);
        return ProjectDto.fromEntity(project);
    }

    @Override
    public Project getProjectEntityById(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() ->
                ApiException.builder()
                        .status(404)
                        .message("No Project found with ID: " + projectId)
                        .build());
        return project;
    }

    @Override
    public void updateProjectStatus(Long projectId, ProjectStatus newStatus) {
        Project project = getProjectEntityById(projectId);

        if (project.getProjectStatus() == ProjectStatus.CLOSED) {
            throw ApiException.builder()
                    .status(423)
                    .message("Project is closed and cannot be updated.")
                    .build();
        }

        if (project.getProjectStatus() == newStatus) {
            throw ApiException.builder()
                    .status(409)
                    .message("Project is already in status: " + newStatus)
                    .build();
        }

        switch (newStatus) {
            case OPEN:
                if (project.getProjectStatus() == ProjectStatus.PENDING) {
                    project.setProjectStatus(ProjectStatus.OPEN);
                    projectRepository.save(project);
                }
                break;

            case CLOSED:
                if (project.getProjectStatus() == ProjectStatus.PENDING) {
                    project.setProjectStatus(ProjectStatus.CLOSED);
                    project.setVisibilityExpirationDate(LocalDate.now().plusDays(3));
                    projectRepository.save(project);

                }
                break;

            case REJECTED:
                if (project.getProjectStatus() == ProjectStatus.PENDING) {
                    project.setProjectStatus(ProjectStatus.REJECTED);
                    projectRepository.save(project);
                }
                break;

            default:
                throw ApiException.builder()
                        .status(400)
                        .message("Invalid status update request.")
                        .build();
        }

        throw ApiException.builder()
                .status(422)
                .message("Project cannot be updated to the requested status.")
                .build();
    }

    @Override
    public ProjectDto approveProject(Long projectId) {

        Project projectToApprove = getProjectEntityById(projectId);

        if (projectToApprove.getProjectStatus() == ProjectStatus.PENDING) {
            projectToApprove.setProjectStatus(ProjectStatus.OPEN);
            projectToApprove = projectRepository.save(projectToApprove);
        } else {
            throw new ApiException("Project cannot be approved at this stage.");
        }
        return ProjectDto.fromEntity(projectToApprove);
    }

    @Override
    public ProjectDto rejectProject(RejectProjectRequestDto rejectProjectRequestDto) {
        Project projectToReject = getProjectEntityById(rejectProjectRequestDto.getProjectId());

        if (projectToReject.getProjectStatus() == ProjectStatus.PENDING) {
            projectToReject.setProjectStatus(ProjectStatus.REJECTED);
            projectToReject = projectRepository.save(projectToReject);
        } else {
            throw new ApiException("Project cannot be rejected at this stage.");
        }
        return ProjectDto.fromEntity(projectToReject);
    }

    @Override
    public List<ProjectDto> getAllPendingProjects() {
        return projectRepository.findByProjectStatus(ProjectStatus.PENDING)
                .stream()
                .map(ProjectDto::fromEntity)
                .toList();
    }

}
