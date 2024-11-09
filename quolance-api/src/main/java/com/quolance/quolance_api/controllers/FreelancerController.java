package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freelancer")
@RequiredArgsConstructor
public class FreelancerController {
    private final FreelancerService freelancerService;
    
    @PostMapping("/submit-application")
    @Operation(
            summary = "Create a new application on a project.",
            description = "Create a new application on a project by passing an ApplicationDto"
    )
    public ResponseEntity<ApplicationDto> applyToProject(@RequestBody ApplicationDto applicationDto) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        ApplicationDto application = freelancerService.submitApplication(applicationDto, freelancer);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/applications")
    @Operation(summary = "View all the application of a freelancer.")
    public ResponseEntity<List<ApplicationDto>> getAllMyApplications() {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        List<ApplicationDto> applications = freelancerService.getMyApplications(freelancer.getId());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/projects")
    @Operation(summary = "View all projects.")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projects = freelancerService.getAllAvailableProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{id}")
    @Operation(
            summary = "View a project.",
            description = "View a project by passing the project id."
    )
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        ProjectDto project = freelancerService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

     @PostMapping("/create-portfolio")
    @Operation(summary = "Create a new portfolio item for the freelancer.")
    public ResponseEntity<PortfolioDto> createPortfolio(@RequestBody PortfolioDto portfolioDto) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        PortfolioDto createdPortfolio = freelancerService.createPortfolio(portfolioDto, freelancer);
        return ResponseEntity.ok(createdPortfolio);
    }

    @GetMapping("/get-all-portfolio")
    @Operation(summary = "Get all portfolio items of the freelancer.")
    public ResponseEntity<List<PortfolioDto>> getAllPortfolios() {
        User freelancer = SecurityUtil.getAuthenticatedUser();  // Get the authenticated user (freelancer)
        List<PortfolioDto> portfolios = freelancerService.getAllPortfoliosByFreelancer(freelancer.getId());
        return ResponseEntity.ok(portfolios);
    }

    @PutMapping("/portfolio/{id}")
    @Operation(summary = "Update a portfolio item.")
    public ResponseEntity<PortfolioDto> updatePortfolio(@PathVariable Long id, @RequestBody PortfolioDto portfolioDto) {
        User freelancer = SecurityUtil.getAuthenticatedUser();  // Get the authenticated user (freelancer)
        PortfolioDto updatedPortfolio = freelancerService.updatePortfolio(id, portfolioDto, freelancer);
        return ResponseEntity.ok(updatedPortfolio);
    }

    @DeleteMapping("/portfolio")
    @Operation(summary = "Delete a portfolio item.")
    public ResponseEntity<Void> deletePortfolio() {
         User freelancer = SecurityUtil.getAuthenticatedUser();  // Get the authenticated user
         freelancerService.deletePortfolioByFreelancerId(freelancer.getId());  // Delete the portfolio by the user's ID
         return ResponseEntity.noContent().build();
    }

}