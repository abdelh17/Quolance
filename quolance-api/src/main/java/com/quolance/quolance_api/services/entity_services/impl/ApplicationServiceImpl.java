package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private static final Logger log = LoggerFactory.getLogger(ApplicationServiceImpl.class);

    @Override
    public void saveApplication(Application application) {
        log.debug("Saving application for freelancer ID: {}", application.getFreelancer().getId());
        applicationRepository.save(application);
        log.info("Successfully saved application with ID: {}", application.getId());

    }

    @Override
    public void deleteApplication(Application application) {
        log.debug("Deleting application with ID: {} for freelancer with ID: {}", application.getId(),application.getFreelancer().getId());
        applicationRepository.delete(application);
        log.info("Successfully deleted application with ID: {}", application.getId());
    }

    @Override
    public Application getApplicationById(Long applicationId) {
        log.debug("Fetching application with ID: {}", applicationId);
        Application application = applicationRepository.findById(applicationId).orElseThrow(() -> {
            log.warn("No application found with ID: {}", applicationId);
            return ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("No Application found with ID: " + applicationId)
                    .build();
        });
        log.debug("Found application: {} of freelancer with ID: {}", application, application.getFreelancer().getId());
        return application;
    }

    @Override
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @Override
    public Application getApplicationByFreelancerIdAndProjectId(Long freelancerId, Long projectId) {
        return applicationRepository.findApplicationByFreelancerIdAndProjectId(freelancerId, projectId);
    }

    @Override
    public Page<Application> getAllApplicationsByFreelancerId(Long freelancerId, Pageable pageable) {
        return applicationRepository.findApplicationsByFreelancerId(freelancerId, pageable);
    }

    @Override
    public List<Application> getAllApplicationsByProjectId(Long projectId) {
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
