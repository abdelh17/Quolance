package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateResponseDto;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ClientWorkflowService {

    ProjectCreateResponseDto createProject(ProjectCreateDto projectCreateDto, User client);

    ProjectDto getProject(UUID projectId, User client);

    void deleteProject(UUID projectId, User client);

    Page<ProjectDto> getAllClientProjects(User client, Pageable pageable);

    List<ApplicationDto> getAllApplicationsToProject(UUID projectId, User client);

    ProjectDto updateProject(UUID projectId, ProjectUpdateDto projectUpdateDto, User client);

    Page<FreelancerProfileDto> getAllAvailableFreelancers(Pageable pageable, FreelancerProfileFilterDto filters);

}
