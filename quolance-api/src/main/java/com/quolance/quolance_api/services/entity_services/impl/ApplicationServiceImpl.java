package com.quolance.quolance_api.services.entity_services.impl;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;


    @Override
    public void saveApplication(Application application) {
        applicationRepository.save(application);
    }

    @Override
    public void deleteApplication(Application application) {
        applicationRepository.delete(application);
    }

    @Override
    public Application getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId).orElseThrow(() ->
                ApiException.builder()
                        .status(HttpServletResponse.SC_NOT_FOUND)
                        .message("No Application found with ID: " + applicationId)
                        .build());
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
    @Transactional
    public List<Application> getAllApplicationsByFreelancerId(Long freelancerId) {
        return applicationRepository.findApplicationsByFreelancerId(freelancerId);
    }

    @Override
    public List<Application> getAllApplicationsByProjectId(Long projectId) {
        return applicationRepository.findApplicationsByProjectId(projectId);
    }

    @Override
    public void updateApplicationStatus(Application application, ApplicationStatus newStatus) {

        if (application.getApplicationStatus() == ApplicationStatus.REJECTED) {
            throw ApiException.builder()
                    .status(423)
                    .message("Application is rejected and cannot be updated.")
                    .build();
        }

        if (application.getApplicationStatus() == newStatus) {
            throw ApiException.builder()
                    .status(409)
                    .message("Application is already in status: " + newStatus)
                    .build();
        }

        application.setApplicationStatus(newStatus);
        applicationRepository.save(application);
    }
}
