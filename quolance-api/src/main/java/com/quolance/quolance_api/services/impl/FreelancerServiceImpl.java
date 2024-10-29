package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.services.ProjectService;
import com.quolance.quolance_api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerServiceImpl implements FreelancerService {
    private final UserService userService;
    private final ApplicationService applicationService;
    private final ProjectService projectService;

    @Override
    public ApplicationDto submitApplication(ApplicationDto applicationDto) {
        User freelancer = userService.findById(applicationDto.getUserId()).orElseThrow();
        Project project = projectService.getProjectEntityById(applicationDto.getProjectId()).orElseThrow();

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