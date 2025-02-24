package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.UpdateFreelancerProfileDto;
import com.quolance.quolance_api.dtos.project.ProjectFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FreelancerWorkflowService {

    void submitApplication(ApplicationCreateDto applicationCreateDto, User freelancer);

    void deleteApplication(UUID applicationId, User freelancer);

    Boolean hasFreelancerAppliedToProject(UUID freelancerId, UUID projectId);

    ApplicationDto getApplication(UUID applicationId, User freelancer);

    Page<ApplicationDto> getAllFreelancerApplications(User freelancer, Pageable pageable);

    Page<ProjectPublicDto> getAllVisibleProjects(Pageable pageable, ProjectFilterDto filters);

    ProjectPublicDto getProject(UUID projectId);

    FreelancerProfileDto getFreelancerProfile(String username);

    void updateFreelancerProfile(UpdateFreelancerProfileDto updateFreelancerProfileDto, User freelancer);

    void uploadProfilePicture(MultipartFile photo, User freelancer);
}