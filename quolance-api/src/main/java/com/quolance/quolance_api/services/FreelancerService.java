package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.User;

import java.util.List;
public interface FreelancerService {

    ApplicationDto submitApplication(ApplicationDto applicationDto, User freelancer);
    List<ApplicationDto> getMyApplications(Long freelancerId);

    List<ProjectDto> getAllAvailableProjects();
    ProjectDto getProjectById(Long id);

    PortfolioDto createPortfolio(PortfolioDto portfoliodto, User freelancer);
    
    PortfolioDto updatePortfolio(Long portfolioId, PortfolioDto portfolioDto, User freelancer);
    void deletePortfolio(Long portfolioId);

    List<PortfolioDto> getAllPortfoliosByFreelancer(Long clientId);

    public void deletePortfolioByFreelancerId(Long freelancerId);
}