package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ApplicationService {

    void saveApplication(Application application);

    void deleteApplication(Application application);

    Application getApplicationById(UUID applicationId);

    void updateApplicationStatus(Application application, ApplicationStatus newStatus);

    Application getApplicationByFreelancerIdAndProjectId(UUID freelancerId, UUID projectId);

    List<Application> getAllApplications();

    Page<Application> getAllApplicationsByFreelancerId(UUID freelancerId, Pageable pageable);

    List<Application> getAllApplicationsByProjectId(UUID projectId);


}
