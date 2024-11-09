package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.services.PortfolioService;
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
    private final PortfolioService portfolioService;

    @Override
    public ApplicationDto submitApplication(ApplicationCreateDto applicationCreateDto, User freelancer) {
        // Retrieve the project entity
        Project project = projectService.getProjectEntityById(applicationCreateDto.getProjectId())
                .orElseThrow(() -> new ApiException("Project not found"));

        // Check if the freelancer has already applied to this project
        if (applicationService.hasFreelancerAppliedToProject(freelancer.getId(), project.getId())) {
            throw new ApiException("You have already applied to this project");
        }

        // Create a new Application (status is default to APPLIED)
        Application applicationToSave = Application.builder()
                .freelancer(freelancer)
                .project(project)
                .build();

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

    @Override
    public PortfolioDto createPortfolio(PortfolioDto portfolioDto, User freelancer) {
        PortfolioDto savedPorfolioDto = portfolioService.createPortfolio(portfolioDto, freelancer);
        return savedPorfolioDto;
    }

    @Override
    public PortfolioDto updatePortfolio(Long portfolioId, PortfolioDto portfolioDto, User freelancer) {
        PortfolioDto updatedPortfolioDto = portfolioService.updatePortfolio(portfolioId, portfolioDto);
        return updatedPortfolioDto;
    }

    @Override
    public List<PortfolioDto> getAllPortfoliosByFreelancer(Long clientId) {
        List<PortfolioDto> projects = portfolioService.getPortfolioByFreelancerId(clientId);
        return projects;
    }

    public void deletePortfolioByFreelancerId(Long freelancerId) {
        portfolioService.deletePortfolioByFreelancerId(freelancerId);
    }

}