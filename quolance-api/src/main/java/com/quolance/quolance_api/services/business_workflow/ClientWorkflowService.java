package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.User;

import java.util.List;

public interface ClientWorkflowService {

    void createProject(ProjectCreateDto projectCreateDto, User client);
    ProjectDto getProject(Long projectId, User client);
    void deleteProject(Long projectId, User client);

    List<ProjectDto> getAllClientProjects(User client);

    List<ApplicationDto> getAllApplicationsToProject(Long projectId, User client);

    ProjectDto updateProject(Long projectId, ProjectUpdateDto projectUpdateDto, User client);

    FreelancerProfileDto getFreelancerProfile(Long freelancerId);
}
