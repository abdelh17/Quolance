package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;

    @Override
    public void saveProject(Project project) {
        log.debug("Saving project: {} for client {}", project.getTitle(), project.getClient().getId());
        projectRepository.save(project);
        log.info("Successfully saved project with ID: {} for client {}", project.getId(), project.getClient().getId());
    }

    @Override
    public void deleteProject(Project project) {
        log.debug("Deleting project with ID: {}", project.getId());
        projectRepository.delete(project);
        log.info("Successfully deleted project with ID: {}", project.getId());
    }

    @Override
    public Project getProjectById(UUID projectId) {
        log.debug("Fetching project with ID: {}", projectId);
        Project project = projectRepository.findById(projectId).orElseThrow(() -> {
            log.warn("No project found with ID: {}", projectId);
            return ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("No Project found with ID: " + projectId)
                    .build();
        });
        log.debug("Found project: {}", project.getTitle());
        return project;
    }

    @Override
    public Page<Project> findAllWithFilters(Specification<Project> spec, Pageable pageable) {
        log.debug("Searching projects with specification: {}", spec);
        Page<Project> projects = projectRepository.findAll(spec, pageable);
        log.debug("Found {} projects matching criteria", projects.getTotalElements());
        return projects;
    }

    @Override
    public Page<Project> getProjectsByStatuses(List<ProjectStatus> projectStatuses, Pageable pageable) {
        log.debug("Fetching projects with statuses: {}", projectStatuses);
        Page<Project> projects = projectRepository.findProjectsByProjectStatusIn(projectStatuses, pageable);
        log.debug("Found {} projects with requested statuses", projects.getTotalElements());
        return projects;
    }

    @Override
    public Page<Project> getProjectsByClientId(UUID clientId, Pageable pageable) {
        log.debug("Fetching projects for client ID: {}", clientId);
        Page<Project> projects = projectRepository.findProjectsByClientId(clientId, pageable);
        log.debug("Found {} projects for client", projects.getTotalElements());
        return projects;
    }

    @Override
    public void updateProjectStatus(Project project, ProjectStatus newStatus) {
        log.debug("Attempting to update project {} status from {} to {}",
                project.getId(), project.getProjectStatus(), newStatus);

        if (project.getProjectStatus() == ProjectStatus.CLOSED) {
            log.warn("Status update failed - project {} is already closed", project.getId());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("Project is closed and cannot be updated.")
                    .build();
        }

        if (project.getProjectStatus() == newStatus) {
            log.warn("Status update failed - project {} is already in status {}",
                    project.getId(), newStatus);
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
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
                if (project.getProjectStatus() == ProjectStatus.PENDING ||
                        project.getProjectStatus() == ProjectStatus.OPEN) {
                    project.setProjectStatus(ProjectStatus.CLOSED);
                    project.setVisibilityExpirationDate(LocalDate.now().plusDays(3));
                    projectRepository.save(project);
                    log.info("Project {} status updated to CLOSED with visibility expiration date",
                            project.getId());
                }
                break;

            case REJECTED:
                if (project.getProjectStatus() == ProjectStatus.PENDING) {
                    project.setProjectStatus(ProjectStatus.REJECTED);
                    projectRepository.save(project);
                    log.info("Project {} status updated to REJECTED", project.getId());
                }
                break;

            default:
                log.warn("Invalid status update attempt for project {}: {}",
                        project.getId(), newStatus);
                throw ApiException.builder()
                        .status(HttpServletResponse.SC_BAD_REQUEST)
                        .message("Invalid status update request.")
                        .build();
        }
    }

    @Override
    public void updateSelectedFreelancer(Project project, User freelancer) {
        log.debug("Updating selected freelancer for project {} to user {}",
                project.getId(), freelancer.getId());
        project.setSelectedFreelancer(freelancer);
        projectRepository.save(project);
        log.info("Successfully updated selected freelancer for project {}", project.getId());
    }

    @Override
    public void updateProject(Project existingProject, ProjectUpdateDto updateDto) {
        log.debug("Attempting to update project: {}", existingProject.getId());

        // First validate update DTO
        validateUpdateDto(updateDto);

        // Validate project status
        if (existingProject.getProjectStatus() != ProjectStatus.PENDING) {
            log.warn("Project update failed - project {} is not in PENDING state",
                    existingProject.getId());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("Project can only be updated when in PENDING state")
                    .build();
        }

        // Proceed with update
        updateProjectFields(existingProject, updateDto);
        projectRepository.save(existingProject);
        log.info("Successfully updated project: {}", existingProject.getId());
    }

    private void validateUpdateDto(ProjectUpdateDto updateDto) {
        log.debug("Validating project update DTO");
        if (updateDto == null) {
            log.warn("Project update validation failed - update data is null");
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Update data cannot be null")
                    .build();
        }

        // Validate title
        if (updateDto.getTitle() != null && updateDto.getTitle().trim().isEmpty()) {
            log.warn("Project update validation failed - empty title");
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Title cannot be empty")
                    .build();
        }

        // Validate description
        if (updateDto.getDescription() != null && updateDto.getDescription().trim().isEmpty()) {
            log.warn("Project update validation failed - empty description");
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Description cannot be empty")
                    .build();
        }

        // Validate category
        if (updateDto.getCategory() != null && updateDto.getCategory().toString().trim().isEmpty()) {
            log.warn("Project update validation failed - empty category");
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Category cannot be empty")
                    .build();
        }

        // Validate priceRange
        if (updateDto.getPriceRange() != null && updateDto.getPriceRange().toString().trim().isEmpty()) {
            log.warn("Project update validation failed - empty price range");
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Price range cannot be empty")
                    .build();
        }

        log.debug("Project update DTO validation completed successfully");
    }

    private void updateProjectFields(Project project, ProjectUpdateDto updateDto) {
        log.debug("Updating fields for project: {}", project.getId());

        if (updateDto.getTitle() != null) {
            project.setTitle(updateDto.getTitle().trim());
            log.debug("Updated project title");
        }

        if (updateDto.getDescription() != null) {
            project.setDescription(updateDto.getDescription().trim());
            log.debug("Updated project description");
        }

        if (updateDto.getCategory() != null) {
            project.setCategory(updateDto.getCategory());
            log.debug("Updated project category");
        }

        if (updateDto.getPriceRange() != null) {
            project.setPriceRange(updateDto.getPriceRange());
            log.debug("Updated project price range");
        }

        if (updateDto.getExpectedDeliveryTime() != null) {
            project.setExpectedDeliveryTime(updateDto.getExpectedDeliveryTime());
            log.debug("Updated project expected delivery time");
        }

        if (updateDto.getExperienceLevel() != null) {
            project.setExperienceLevel(updateDto.getExperienceLevel());
            log.debug("Updated project experience level");
        }

        log.debug("Completed updating project fields");
    }

    @Override
    public void setProjectRejectionReason(Project project, String rejectionReason) {
        log.debug("Setting rejection reason for project {}", project.getId());
        project.setRejectionReason(rejectionReason);
        projectRepository.save(project);
        log.info("Successfully set rejection reason for project {}", project.getId());
    }
}