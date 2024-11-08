package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.services.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ConcurrentModificationException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ApplicationProcessWorkflowImpl implements ApplicationProcessWorkflow {

    private final ApplicationService applicationService;
    private final ProjectService projectService;

    @Override
    @Transactional
    public void selectFreelancer(Long applicationId, Long clientId) {
        try {
            // Fetch the application
            Application application = applicationService.getApplicationEntityById(applicationId)
                    .orElseThrow(() -> ApiException.builder().status(404).message("Application not found").build());

            // Check if the client is the owner of the project
            if (!application.getProject().getClient().getId().equals(clientId)) {
                throw ApiException.builder()
                        .status(403)
                        .message("You are not authorized to select a freelancer for this project")
                        .build();
            }

            // Check if the application is still in APPLIED state
            if (application.getStatus() != ApplicationStatus.APPLIED) {
                throw ApiException.builder().status(409).message("Cannot select freelancer as the " +
                        "application status is no longer active.").build();

            }

            // Update the application status to PENDING_CONFIRMATION
            application.setStatus(ApplicationStatus.PENDING_CONFIRMATION);
            applicationService.updateApplication(application);

            // TODO: Send notification to the freelancer

            // FIXME: The project's selected freelancer id is purposely not updated here,
            //  as the freelancer needs to confirm the offer first

        } catch (OptimisticLockException e) {
            throw ApiException.builder().status(409).message("Application has been updated by another user. " +
                    "Please try again or refresh the page.").build();
            // TODO: Do something with the `OptimisticLockException e`
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

}
