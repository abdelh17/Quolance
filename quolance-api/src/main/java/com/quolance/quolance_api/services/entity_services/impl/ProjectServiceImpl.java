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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private static final Logger log = LoggerFactory.getLogger(ProjectServiceImpl.class);

    private final ProjectRepository projectRepository;

    @Override
    public void saveProject(Project project) {
        log.debug("Saving project: {} for user ID: {}", project.getTitle(), project.getClient().getId());
        projectRepository.save(project);
        log.info("Successfully saved project with ID: {} for user ID: {}", project.getId(), project.getClient().getId());
    }

    @Override
    public void deleteProject(Project project) {
        log.debug("Deleting project with ID: {} for user ID: {}", project.getId(), project.getClient().getId());
        projectRepository.delete(project);
        log.info("Successfully deleted project with ID: {} for user ID: {}", project.getId(), project.getClient().getId());
    }

    @Override
    public Project getProjectById(Long projectId) {
        log.debug("Fetching project with ID: {}", projectId);
        Project project = projectRepository.findById(projectId).orElseThrow(() -> {
            log.warn("No project found with ID: {}", projectId);
            return ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("No Project found with ID: " + projectId)
                    .build();
        });
        log.debug("Found project: {} for user ID: {}", project.getTitle(), project.getClient().getId());
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
    public Page<Project> getProjectsByClientId(Long clientId, Pageable pageable) {
        log.debug("Fetching projects for client ID: {}", clientId);
        Page<Project> projects = projectRepository.findProjectsByClientId(clientId, pageable);
        log.debug("Found {} projects for client ID: {}", projects.getTotalElements(), clientId);
        return projects;
    }

    @Override
    public void updateProjectStatus(Project project, ProjectStatus newStatus) {
        log.debug("Attempting to update project {} status from {} to {} for user ID: {}",
                project.getId(), project.getProjectStatus(), newStatus, project.getClient().getId());

        if (project.getProjectStatus() == ProjectStatus.CLOSED) {
            log.warn("Status update failed - project {} is already closed for user ID: {}",
                    project.getId(), project.getClient().getId());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("Project is closed and cannot be updated.")
                    .build();
        }

        if (project.getProjectStatus() == newStatus) {
            log.warn("Status update failed - project {} is already in status {} for user ID: {}",
                    project.getId(), newStatus, project.getClient().getId());
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
                    log.info("Project {} status updated to OPEN for user ID: {}", project.getId(), project.getClient().getId());
                }
                break;

            case CLOSED:
                if (project.getProjectStatus() == ProjectStatus.PENDING ||
                        project.getProjectStatus() == ProjectStatus.OPEN) {
                    project.setProjectStatus(ProjectStatus.CLOSED);
                    project.setVisibilityExpirationDate(LocalDate.now().plusDays(3));
                    projectRepository.save(project);
                    log.info("Project {} status updated to CLOSED with visibility expiration date for user ID: {}",
                            project.getId(), project.getClient().getId());
                }
                break;

            case REJECTED:
                if (project.getProjectStatus() == ProjectStatus.PENDING) {
                    project.setProjectStatus(ProjectStatus.REJECTED);
                    projectRepository.save(project);
                    log.info("Project {} status updated to REJECTED for user ID: {}", project.getId(), project.getClient().getId());
                }
                break;

            default:
                log.warn("Invalid status update attempt for project {}: {} for user ID: {}",
                        project.getId(), newStatus, project.getClient().getId());
                throw ApiException.builder()
                        .status(HttpServletResponse.SC_BAD_REQUEST)
                        .message("Invalid status update request.")
                        .build();
        }
    }

    @Override
    public void updateSelectedFreelancer(Project project, User freelancer) {
        log.debug("Updating selected freelancer for project {} to user {} for client ID: {}",
                project.getId(), freelancer.getId(), project.getClient().getId());
        project.setSelectedFreelancer(freelancer);
        projectRepository.save(project);
        log.info("Successfully updated selected freelancer for project {} for client ID: {}",
                project.getId(), project.getClient().getId());
    }

    @Override
    public void updateProject(Project existingProject, ProjectUpdateDto updateDto) {
        log.debug("Attempting to update project: {} for user ID: {}", existingProject.getId(), existingProject.getClient().getId());

        // First validate update DTO
        validateUpdateDto(updateDto);

        // Validate project status
        if (existingProject.getProjectStatus() != ProjectStatus.PENDING) {
            log.warn("Project update failed - project {} is not in PENDING state for user ID: {}",
                    existingProject.getId(), existingProject.getClient().getId());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("Project can only be updated when in PENDING state")
                    .build();
        }

        // Proceed with update
        updateProjectFields(existingProject, updateDto);
        projectRepository.save(existingProject);
        log.info("Successfully updated project: {} for user ID: {}", existingProject.getId(), existingProject.getClient().getId());
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
        log.debug("Updating fields for project: {} for user ID: {}", project.getId(), project.getClient().getId());

        if (updateDto.getTitle() != null) {
            project.setTitle(updateDto.getTitle().trim());
            log.debug("Updated project title for user ID: {}", project.getClient().getId());
        }

        if (updateDto.getDescription() != null) {
            project.setDescription(updateDto.getDescription().trim());
            log.debug("Updated project description for user ID: {}", project.getClient().getId());
        }

        if (updateDto.getCategory() != null) {
            project.setCategory(updateDto.getCategory());
            log.debug("Updated project category for user ID: {}", project.getClient().getId());
        }

        if (updateDto.getPriceRange() != null) {
            project.setPriceRange(updateDto.getPriceRange());
            log.debug("Updated project price range for user ID: {}", project.getClient().getId());
        }

        if (updateDto.getExpectedDeliveryTime() != null) {
            project.setExpectedDeliveryTime(updateDto.getExpectedDeliveryTime());
            log.debug("Updated project expected delivery time for user ID: {}", project.getClient().getId());
        }

        if (updateDto.getExperienceLevel() != null) {
            project.setExperienceLevel(updateDto.getExperienceLevel());
            log.debug("Updated project experience level for user ID: {}", project.getClient().getId());
        }

        log.debug("Completed updating project fields for user ID: {}", project.getClient().getId());
    }
}