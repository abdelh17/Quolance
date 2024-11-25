package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FreelancerWorkflowServiceImpl implements FreelancerWorkflowService {

    private final ProjectService projectService;
    private final ApplicationService applicationService;

    @Override
    public void submitApplication(ApplicationCreateDto applicationCreateDto, User freelancer) {

        if(applicationService.getApplicationByFreelancerIdAndProjectId(freelancer.getId(), applicationCreateDto.getProjectId()) != null){
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("You have already applied to this project.")
                    .build();
        }

        try {
            Application application = ApplicationCreateDto.toEntity(applicationCreateDto);
            Project project = projectService.getProjectById(applicationCreateDto.getProjectId());

            if(!project.isProjectApproved()){
                throw ApiException.builder()
                        .status(HttpServletResponse.SC_CONFLICT)
                        .message("You can't apply to this project.")
                        .build();
            }

            application.setFreelancer(freelancer);
            application.setProject(project);

            applicationService.saveApplication(application);

        } catch (OptimisticLockException e) {
            handleOptimisticLockException(e);
        }

    }

    // Might remove this method
    @Override
    public ApplicationDto getApplication(Long applicationId, User freelancer) {
        Application application = applicationService.getApplicationById(applicationId);
        if (!application.isOwnedBy(freelancer.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to view this application.")
                    .build();
        }
        return ApplicationDto.fromEntity(application);
    }

    @Override
    public void deleteApplication(Long applicationId, User freelancer) {
        Application application = applicationService.getApplicationById(applicationId);
        if (!application.isOwnedBy(freelancer.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to delete this application.")
                    .build();
        }
        applicationService.deleteApplication(application);
    }

//    // Might remove this method
//    @Override
//    public ApplicationDto getApplicationToProject(Long projectId, User freelancer) {
//        Application application = applicationService.getApplicationByFreelancerIdAndProjectId(freelancer.getId(), projectId);
//        if (application == null) {
//            throw ApiException.builder()
//                    .status(HttpServletResponse.SC_NOT_FOUND)
//                    .message("No application found for this project.")
//                    .build();
//        }
//        return ApplicationDto.fromEntity(application);
//    }

    @Override
    public List<ApplicationDto> getAllFreelancerApplications(User freelancer) {
        return applicationService.getAllApplicationsByFreelancerId(freelancer.getId()).stream()
                .map(ApplicationDto::fromEntity)
                .toList();
    }

    @Override
    public List<ProjectPublicDto> getAllAvailableProjects() {
        LocalDate currentDate = LocalDate.now();

        // Get all projects that are OPEN or CLOSED
        List<Project> openAndClosedProjects = projectService.getProjectsByStatuses(List.of(ProjectStatus.OPEN, ProjectStatus.CLOSED));

        // removed the project that are both status CLOSED and visibilityExpirationDate is before currentDate
        openAndClosedProjects.removeIf(project ->
                project.getProjectStatus().equals(ProjectStatus.CLOSED) &&
                        project.getVisibilityExpirationDate().isBefore(currentDate));

        return openAndClosedProjects.stream()
                .map(ProjectPublicDto::fromEntity)
                .toList();
    }

    @Override
    public ProjectPublicDto getProject(Long projectId) {
        if(ProjectPublicDto.fromEntity(projectService.getProjectById(projectId)).getProjectStatus().equals(ProjectStatus.PENDING)){
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("Project is not available for viewing.")
                    .build();
        }
        return ProjectPublicDto.fromEntity(projectService.getProjectById(projectId));
    }

    // Helper method to handle optimistic lock exception
    private void handleOptimisticLockException(Exception e) {
        throw ApiException.builder()
                .status(HttpServletResponse.SC_CONFLICT)
                .message("The ressource was modified by another user. Please refresh the page and try again.")
                .errors(Map.of("optimisticLock", e.getMessage()))
                .build();
    }

}