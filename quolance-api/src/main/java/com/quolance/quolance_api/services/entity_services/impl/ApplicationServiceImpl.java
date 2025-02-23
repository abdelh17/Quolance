package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;

    @Override
    public void saveApplication(Application application) {
        applicationRepository.save(application);
        log.info("Successfully saved application with ID: {} for user with ID {}", application.getId(), application.getFreelancer().getId());
    }

    @Override
    public void deleteApplication(Application application) {
        applicationRepository.delete(application);
        log.info("Successfully deleted application with ID: {}", application.getId());
    }

    @Override
    public Application getApplicationById(UUID applicationId) {
        log.debug("Fetching application with ID: {}", applicationId);
        Application application = applicationRepository.findById(applicationId).orElseThrow(() -> {
            log.warn("No application found with ID: {}", applicationId);
            return ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("No Application found with ID: " + applicationId)
                    .build();
        });
        return application;
    }

    @Override
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @Override
    public Application getApplicationByFreelancerIdAndProjectId(UUID freelancerId, UUID projectId) {
        return applicationRepository.findApplicationByFreelancerIdAndProjectId(freelancerId, projectId);
    }

    @Override
    public Page<Application> getAllApplicationsByFreelancerId(UUID freelancerId, Pageable pageable) {
        return applicationRepository.findApplicationsByFreelancerId(freelancerId, pageable);
    }

    @Override
    public List<Application> getAllApplicationsByProjectId(UUID projectId) {
        return applicationRepository.findApplicationsByProjectId(projectId);
    }

    @Override
    public void updateApplicationStatus(Application application, ApplicationStatus newStatus) {

        log.debug("Attempting to update application {} status from {} to {}",
                application.getId(),
                application.getApplicationStatus(),
                newStatus);

        // Rule: Cannot update status if it is already the newStatus
        if (application.getApplicationStatus() == newStatus) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("Application is already in status: " + newStatus)
                    .build();
        }

        // Rule: Cannot update status if it is REJECTED
        if (application.getApplicationStatus() == ApplicationStatus.REJECTED) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("Application is rejected and cannot be updated.")
                    .build();
        }

        // Rule: Cannot update status if it is ACCEPTED
        if (application.getApplicationStatus() == ApplicationStatus.ACCEPTED) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("Application is accepted and cannot be updated.")
                    .build();
        }

        // Update logic based on the new status
        switch (newStatus) {
            case ACCEPTED:
                if (application.getApplicationStatus() == ApplicationStatus.APPLIED) {
                    application.setApplicationStatus(ApplicationStatus.ACCEPTED);
                    applicationRepository.save(application);
                    log.info("Successfully updated application {} status to ACCEPTED", application.getId());
                } else {
                    log.warn("Invalid status transition to ACCEPTED for application: {}", application.getId());
                    throw ApiException.builder()
                            .status(HttpServletResponse.SC_BAD_REQUEST)
                            .message("Invalid status transition to ACCEPTED.")
                            .build();
                }
                break;

            case REJECTED:
                if (application.getApplicationStatus() == ApplicationStatus.APPLIED) {
                    application.setApplicationStatus(ApplicationStatus.REJECTED);
                    applicationRepository.save(application);
                    log.info("Successfully updated application {} status to REJECTED", application.getId());
                } else {
                    log.warn("Invalid status transition to REJECTED for application: {}", application.getId());
                    throw ApiException.builder()
                            .status(HttpServletResponse.SC_BAD_REQUEST)
                            .message("Invalid status transition to REJECTED.")
                            .build();
                }
                break;

            default:
                throw ApiException.builder()
                        .status(HttpServletResponse.SC_BAD_REQUEST)
                        .message("Invalid status update request.")
                        .build();
        }
    }

}
