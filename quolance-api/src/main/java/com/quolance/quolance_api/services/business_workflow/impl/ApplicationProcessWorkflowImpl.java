package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Map;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ApplicationProcessWorkflowImpl implements ApplicationProcessWorkflow {

    private final ApplicationService applicationService;
    private final ProjectService projectService;

    @Override
    @Transactional
    public void selectFreelancer(Long applicationId, User client) {
        try {
            // Fetch the application
            Application application = applicationService.getApplicationById(applicationId);
            Project project = application.getProject();

            validateClientProjectOwnership(project, client.getId());
            validateProjectForFreelancerSelection(project);
            validateApplicationStatus(application, ApplicationStatus.APPLIED);

            applicationService.updateApplicationStatus(application, ApplicationStatus.ACCEPTED);
            projectService.updateProjectStatus(project, ProjectStatus.CLOSED);
            projectService.updateSelectedFreelancer(project, application.getFreelancer());

        } catch (OptimisticLockException e) {
            handleOptimisticLockException(e);
        }
    }

    @Override
    public void rejectApplication(Long applicationId, Long clientId) {
        // TODO: Implement this method
    }

    @Override
    public void rejectManyApplications(List<Long> applicationId, Long clientId) {
        // TODO: Implement this method
    }

    @Override
    public void confirmOffer(Long applicationId, Long freelancerId) {
        // TODO: Implement this method
        // FIXME: The project's selected freelancer id is purposely not updated here,
        //  as the freelancer needs to confirm the offer first
    }

    @Override
    public void cancelApplication(Long applicationId, Long freelancerId) {
        // TODO: Implement this method
    }

    // ==================== Utility Methods ====================
    private void validateClientProjectOwnership(Project project, Long clientId) {
        if (!project.isOwnedBy(clientId)) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to perform this action on this project")
                    .build();
        }
    }

    private void validateFreelancerApplicationOwnership(Application application, Long freelancerId) {
        if (!application.isOwnedBy(freelancerId)) {
            throw ApiException.builder()
                    .status(403)
                    .message("You are not authorized to perform this action")
                    .build();
        }
    }

    private void validateProjectForFreelancerSelection(Project project) {
        if (!project.isProjectApproved()) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("Project is not approved for freelancer selection")
                    .build();
        }

        if (project.hasSelectedFreelancer()) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("A freelancer is already working on this project")
                    .build();
        }
    }

    private void validateProjectForConfirmation(Project project) {
        if (!project.isProjectApproved()) {
            throw ApiException.builder()
                    .status(409)
                    .message("Project is not approved for confirmation")
                    .build();
        }
    }

    private void validateApplicationStatus(Application application, ApplicationStatus... validStatuses) {
        for (ApplicationStatus status : validStatuses) {
            if (application.getApplicationStatus() == status) {
                return;
            }
        }
        throw ApiException.builder()
                .status(409)
                .message("Invalid application status for this action")
                .build();
    }

    private void handleOptimisticLockException(Exception e) {
        throw ApiException.builder()
                .status(409)
                .message("The resource was modified by another user. Please refresh the page and try again.")
                .errors(Map.of("optimisticLock", e.getMessage()))
                .build();
    }

}
