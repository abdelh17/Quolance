package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerServiceImpl implements FreelancerService {
    private final ApplicationService applicationService;
    private final ProjectService projectService;

    @Override
    public ApplicationDto submitApplication(ApplicationDto applicationDto, User freelancer) {
        Project project = projectService.getProjectEntityById(applicationDto.getProjectId())
                .orElseThrow(() -> new ApiException("Project not found"));

        if (applicationService.hasFreelancerAppliedToProject(freelancer.getId(), project.getId())) {
            throw new ApiException("You have already applied to this project");
        }

        Application applicationToSave = ApplicationDto.toEntity(applicationDto);

        applicationToSave.setFreelancer(freelancer);
        applicationToSave.setProject(project);

        ApplicationDto savedApplication = applicationService.createApplication(applicationToSave);
        return savedApplication;
    }

    @Override
    public List<ApplicationDto> getMyApplications(Long freelancerId) {
        List<ApplicationDto> applications = applicationService.getApplicationByFreelancerId(freelancerId);
        return applications;
    }

    @Override
    public List<ProjectDto> getAllAvailableProjects() {
        return projectService.getAllProjects();
    }

    @Override
    public ProjectDto getProjectById(Long id) {
        return projectService.getProjectById(id);
    }
}