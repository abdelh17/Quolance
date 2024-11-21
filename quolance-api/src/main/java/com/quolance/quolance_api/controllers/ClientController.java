package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.ClientWorkflowService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientWorkflowService clientWorkflowService;
    private final ApplicationProcessWorkflow applicationProcessWorkflow;

    @PostMapping("/create-project")
    @Operation(
            summary = "Create a project",
            description = "Create a project by passing the project details"
    )
    public ResponseEntity<String> createProject(@RequestBody ProjectCreateDto projectCreateDto) {
        User client = SecurityUtil.getAuthenticatedUser();
        clientWorkflowService.createProject(projectCreateDto, client);
        return ResponseEntity.ok("Project created successfully");
    }

    @GetMapping("/projects/{projectId}")
    @Operation(
            summary = "Get a project",
            description = "Get a project by passing the project ID"
    )
    public ResponseEntity<ProjectDto> getProject(@PathVariable(name = "projectId") Long projectId) {
        User client = SecurityUtil.getAuthenticatedUser();
        ProjectDto project = clientWorkflowService.getProject(projectId, client);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/projects/{projectId}")
    @Operation(
            summary = "Delete a project",
            description = "Delete a project by passing the project ID"
    )
    public ResponseEntity<String> deleteProject(@PathVariable(name = "projectId") Long projectId) {
        User client = SecurityUtil.getAuthenticatedUser();
        clientWorkflowService.deleteProject(projectId, client);
        return ResponseEntity.ok("Project deleted successfully");
    }

    @GetMapping("/projects/all")
    @Operation(
            summary = "Get all projects of a client",
            description = "Get all projects of a client"
    )
    public ResponseEntity<List<ProjectDto>> getAllClientProjects() {
        User client = SecurityUtil.getAuthenticatedUser();
        List<ProjectDto> projects = clientWorkflowService.getAllClientProjects(client);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{projectId}/applications/all")
    @Operation(
            summary = "Get all applications on a project",
            description = "Get all applications on a project by passing the project ID"
    )
    public ResponseEntity<List<ApplicationDto>> getAllApplicationsToProject(@PathVariable(name = "projectId") Long projectId) {
        User client = SecurityUtil.getAuthenticatedUser();
        List<ApplicationDto> applications = clientWorkflowService.getAllApplicationsToProject(projectId, client);
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/applications/{applicationId}/select-freelancer")
    @Operation(
            summary = "Select a freelancer for a project",
            description = "Select a freelancer for a project by passing the application ID"
    )
    public ResponseEntity<String> selectFreelancer(@PathVariable(name = "applicationId") Long applicationId) {
        User client = SecurityUtil.getAuthenticatedUser();
        applicationProcessWorkflow.selectFreelancer(applicationId, client);
        // TODO: When a notification/communication service is implemented, send a notification to the freelancer
        return ResponseEntity.ok("Freelancer selected successfully");
    }

    @PostMapping("/applications/{applicationId}/reject-freelancer")
    @Operation(
            summary = "Reject a freelancer for a project",
            description = "Reject a freelancer for a project by passing the application ID"
    )
    public ResponseEntity<String> rejectFreelancer(@PathVariable(name = "applicationId") Long applicationId) {
        User client = SecurityUtil.getAuthenticatedUser();
        applicationProcessWorkflow.rejectApplication(applicationId, client);
        // TODO: When a notification/communication service is implemented, send a notification to the freelancer
        return ResponseEntity.ok("Freelancer rejected successfully");
    }

    @PostMapping("/applications/bulk/reject-freelancer")
    @Operation(
            summary = "Reject many freelancers for a project",
            description = "Reject many freelancers for a project by passing a list of ids"
    )
    public ResponseEntity<String> rejectManyFreelancers(@RequestBody List<Long> applicationIds) {
        User client = SecurityUtil.getAuthenticatedUser();
        applicationProcessWorkflow.rejectManyApplications(applicationIds, client);
        return ResponseEntity.ok("All selected freelancers rejected successfully");
    }

}
