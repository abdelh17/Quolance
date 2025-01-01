package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.UpdateFreelancerProfileDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FreelancerWorkflowService {

    void submitApplication(ApplicationCreateDto applicationCreateDto, User freelancer);
    void deleteApplication(Long applicationId, User freelancer);
    ApplicationDto getApplication(Long applicationId, User freelancer);

    List<ApplicationDto> getAllFreelancerApplications(User freelancer);
    List<ProjectPublicDto> getAllAvailableProjects();
    ProjectPublicDto getProject(Long projectId);

    FreelancerProfileDto getFreelancerProfile(String username);
    void updateFreelancerProfile(UpdateFreelancerProfileDto updateFreelancerProfileDto, User freelancer);
    void uploadProfilePicture(MultipartFile photo, User freelancer);
}