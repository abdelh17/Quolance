package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationProcessWorkflowImpl implements ApplicationProcessWorkflow {

    private final ApplicationService applicationService;
    private final ProjectService projectService;
    private final NotificationMessageService notificationMessageService;

    @Override
    @Transactional
    public void selectFreelancer(UUID applicationId, User client) {
        try {
            // Fetch the application
            Application application = applicationService.getApplicationById(applicationId);
            Project project = application.getProject();

            validateClientProjectOwnership(project, client.getId());
            validateProjectForFreelancerSelection(project);
            validateProjectForConfirmation(project);

            // Accept the chosen application
            applicationService.updateApplicationStatus(application, ApplicationStatus.ACCEPTED);
            // Update project to closed and assign selected freelancer
            projectService.updateProjectStatus(project, ProjectStatus.CLOSED);
            projectService.updateSelectedFreelancer(project, application.getFreelancer());

            // Notify the accepted freelancer
            String acceptNotification = "Congratulations! Your application for project '" + project.getTitle() + "' has been accepted.";
            notificationMessageService.sendNotificationToUser(application.getFreelancer(), application.getFreelancer(), acceptNotification);

            // Reject all other applications and notify them
            applicationService.getAllApplicationsByProjectId(project.getId()).forEach(app -> {
                if (!app.getId().equals(applicationId)) {
                    applicationService.updateApplicationStatus(app, ApplicationStatus.REJECTED);
                    String rejectNotification = "We regret to inform you that your application for project '" + project.getTitle() + "' has been rejected.";
                    notificationMessageService.sendNotificationToUser(app.getFreelancer(), app.getFreelancer(), rejectNotification);
                }
            });

            // Optionally, notify the client about the successful selection
            String clientNotification = "You have successfully selected a freelancer for your project '" + project.getTitle() + "'.";
            notificationMessageService.sendNotificationToUser(client, client, clientNotification);

        } catch (OptimisticLockException e) {
            handleOptimisticLockException(e);
        }
    }

    @Override
    public void rejectApplication(UUID applicationId, User client) {
        try {
            // Fetch the application
            Application application = applicationService.getApplicationById(applicationId);
            Project project = application.getProject();

            validateClientProjectOwnership(project, client.getId());
            validateProjectForFreelancerSelection(project);
            validateProjectForConfirmation(project);

            applicationService.updateApplicationStatus(application, ApplicationStatus.REJECTED);

            // Notify freelancer that their application has been rejected.
            String rejectNotification = "Your application for project '" + project.getTitle() + "' has been rejected.";
            notificationMessageService.sendNotificationToUser(application.getFreelancer(), application.getFreelancer(), rejectNotification);

            // Optionally, notify the client as well.
            String clientNotification = "You have rejected an application for your project '" + project.getTitle() + "'.";
            notificationMessageService.sendNotificationToUser(client, client, clientNotification);

        } catch (OptimisticLockException e) {
            handleOptimisticLockException(e);
        }
    }

    @Override
    public void rejectManyApplications(List<UUID> applicationIds, User client) {
        Map<String, String> combinedResults = new LinkedHashMap<>();

        for (int i = 0; i < applicationIds.size(); i++) {
            UUID applicationId = applicationIds.get(i);
            try {
                rejectApplication(applicationId, client);
                combinedResults.put("[Request " + (i + 1) + "] Rejecting application with ID " + applicationId + ": ",
                        "successful");
            } catch (ApiException e) {
                combinedResults.put("[Request " + (i + 1) + "] Rejecting application with ID " + applicationId + ": ",
                        e.getMessage());
            }
        }

        if (!combinedResults.isEmpty()) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_PARTIAL_CONTENT)
                    .message("Some rejection requests could not be processed.")
                    .errors(combinedResults)
                    .build();
        }
    }

    @Override
    public void cancelApplication(UUID applicationId, User freelancer) {
        try {
            Application application = applicationService.getApplicationById(applicationId);
            validateFreelancerApplicationOwnership(application, freelancer.getId());
            if (application.getApplicationStatus() == ApplicationStatus.ACCEPTED) {
                throw ApiException.builder()
                        .status(HttpServletResponse.SC_CONFLICT)
                        .message("You cannot cancel an application that has been accepted")
                        .build();
            }
            applicationService.deleteApplication(application);

            // Notify freelancer that the application cancellation was successful.
            String cancelNotification = "Your application for project '" + application.getProject().getTitle() + "' has been cancelled successfully.";
            notificationMessageService.sendNotificationToUser(freelancer, freelancer, cancelNotification);

        } catch (OptimisticLockException e) {
            handleOptimisticLockException(e);
        }
    }


    // ==================== Utility Methods ====================
    private void validateClientProjectOwnership(Project project, UUID clientId) {
        if (!project.isOwnedBy(clientId)) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to perform this action on this project")
                    .build();
        }
    }

    private void validateFreelancerApplicationOwnership(Application application, UUID freelancerId) {
        if (!application.isOwnedBy(freelancerId)) {
            throw ApiException.builder()
                    .status(403)
                    .message("You are not authorized to perform this action on that application")
                    .build();
        }
    }

    private void validateProjectForFreelancerSelection(Project project) {
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
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("Cannot perform this action, project is either pending or rejected")
                    .build();
        }
    }

    private void handleOptimisticLockException(Exception e) {
        throw ApiException.builder()
                .status(HttpServletResponse.SC_CONFLICT)
                .message("The resource was modified by another user. Please refresh the page and try again.")
                .errors(Map.of("optimisticLock", e.getMessage()))
                .build();
    }

}
