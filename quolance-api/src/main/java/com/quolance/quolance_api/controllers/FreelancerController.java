package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
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

    private final FreelancerWorkflowService freelancerWorkflowService;
    private final ApplicationProcessWorkflow applicationProcessWorkflow;

    @PostMapping("/submit-application")
    @Operation(
            summary = "Create a new application on a project.",
            description = "Create a new application on a project by passing an ApplicationCreateDto"
    )
    public void applyToProject(@RequestBody ApplicationCreateDto applicationCreateDto) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        freelancerWorkflowService.submitApplication(applicationCreateDto, freelancer);
    }

    @GetMapping("/applications/{applicationId}")
    @Operation(
            summary = "View an application.",
            description = "View an application by passing the application id."
    )
    public ResponseEntity<ApplicationDto> getApplication(@PathVariable(name = "applicationId") Long applicationId) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        ApplicationDto application = freelancerWorkflowService.getApplication(applicationId, freelancer);
        return ResponseEntity.ok(application);
    }

    @DeleteMapping("/applications/{applicationId}")
    @Operation(
            summary = "Delete an application.",
            description = "Delete an application by passing the application id."
    )
    public ResponseEntity<String> deleteApplication(@PathVariable(name = "applicationId") Long applicationId) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        applicationProcessWorkflow.cancelApplication(applicationId, freelancer);
        return ResponseEntity.ok("Application deleted successfully.");
    }

    @GetMapping("/applications/all")
    @Operation(
            summary = "View all the application of a freelancer.",
            description = " "
    )
    public ResponseEntity<List<ApplicationDto>> getAllFreelancerApplications() {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        List<ApplicationDto> applications = freelancerWorkflowService.getAllFreelancerApplications(freelancer);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/projects/all")
    @Operation(
            summary = "View all available projects.",
            description = "View all projects that are open or closed and still in the visibility of the freelancer."
    )
    public ResponseEntity<List<ProjectPublicDto>> getAllAvailableProjects() {
        List<ProjectPublicDto> availableProjects = freelancerWorkflowService.getAllAvailableProjects();
        return ResponseEntity.ok(availableProjects);
    }

    @GetMapping("/projects/{projectId}")
    @Operation(
            summary = "View a project.",
            description = "View a project by passing the project id."
    )
    public ResponseEntity<ProjectPublicDto> getProjectById(@PathVariable(name = "projectId") Long projectId) {
        ProjectPublicDto project = freelancerWorkflowService.getProject(projectId);
        return ResponseEntity.ok(project);
    }

}

// TEST GIT COMMIT, TO REMOVE