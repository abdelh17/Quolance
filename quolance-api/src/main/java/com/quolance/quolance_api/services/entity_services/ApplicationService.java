package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ApplicationService {

    void saveApplication(Application application);

    void deleteApplication(Application application);

    Application getApplicationById(Long applicationId);

    void updateApplicationStatus(Application application, ApplicationStatus newStatus);

    Application getApplicationByFreelancerIdAndProjectId(Long freelancerId, Long projectId);

    List<Application> getAllApplications();

    Page<Application> getAllApplicationsByFreelancerId(Long freelancerId, Pageable pageable);

    List<Application> getAllApplicationsByProjectId(Long projectId);


}
