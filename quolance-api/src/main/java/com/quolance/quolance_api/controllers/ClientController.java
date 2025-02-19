package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.paging.PageResponseDto;
import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectEvaluationResult;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.ClientWorkflowService;
import com.quolance.quolance_api.util.PaginationUtils;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@Slf4j
public class ClientController {

    private final ClientWorkflowService clientWorkflowService;
    private final ApplicationProcessWorkflow applicationProcessWorkflow;
    private final PaginationUtils paginationUtils;

    @PostMapping("/create-project")
    @Operation(
            summary = "Create a project",
            description = "Create a project by passing the project details. Returns moderation result."
    )
    public ResponseEntity<ProjectEvaluationResult> createProject(@RequestBody ProjectCreateDto projectCreateDto) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client {} attempting to create project", client.getId());
        ProjectEvaluationResult result = clientWorkflowService.createProject(projectCreateDto, client);
        log.info("Project creation completed for client {}. Moderation status: approved={}, review={}",
                client.getId(), result.isApproved(), result.isRequiresManualReview());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/projects/{projectId}")
    @Operation(
            summary = "Get a project",
            description = "Get a project by passing the project ID"
    )
    public ResponseEntity<ProjectDto> getProject(@PathVariable(name = "projectId") UUID projectId) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to get project with ID {}", client.getId(), projectId);
        ProjectDto project = clientWorkflowService.getProject(projectId, client);
        log.info("Client with ID {} successfully got project with ID {}", client.getId(), projectId);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/projects/{projectId}")
    @Operation(
            summary = "Delete a project",
            description = "Delete a project by passing the project ID"
    )
    public ResponseEntity<String> deleteProject(@PathVariable(name = "projectId") UUID projectId) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to delete project with ID {}", client.getId(), projectId);
        clientWorkflowService.deleteProject(projectId, client);
        log.info("Client with ID {} successfully deleted project with ID {}", client.getId(), projectId);
        return ResponseEntity.ok("Project deleted successfully");
    }

    @PutMapping("/projects/{projectId}")
    @Operation(
            summary = "Update a project",
            description = "Update an existing project by passing the project details"
    )
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable(name = "projectId") UUID projectId,
            @RequestBody ProjectUpdateDto projectUpdateDto) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to update project with ID {}", client.getId(), projectId);
        ProjectDto updatedProject = clientWorkflowService.updateProject(projectId, projectUpdateDto, client);
        log.info("Client with ID {} successfully updated project with ID {}", client.getId(), projectId);
        return ResponseEntity.ok(updatedProject);
    }

    @GetMapping("/projects/all")
    @Operation(
            summary = "Get all projects of a client",
            description = "Get all projects of a client"
    )
    public ResponseEntity<PageResponseDto<ProjectDto>> getAllClientProjects(
            @Valid PageableRequestDto pageableRequest) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to get all his projects", client.getId());
        Page<ProjectDto> projects = clientWorkflowService.getAllClientProjects(
                client,
                paginationUtils.createPageable(pageableRequest)
        );
        log.info("Client with ID {} successfully got all his projects. {} returned", client.getId(), projects.getTotalElements());
        return ResponseEntity.ok(new PageResponseDto<>(projects));
    }

    @GetMapping("/projects/{projectId}/applications/all")
    @Operation(
            summary = "Get all applications on a project",
            description = "Get all applications on a project by passing the project ID"
    )
    public ResponseEntity<List<ApplicationDto>> getAllApplicationsToProject(@PathVariable(name = "projectId") UUID projectId) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to get all applications to project with ID {}", client.getId(), projectId);
        List<ApplicationDto> applications = clientWorkflowService.getAllApplicationsToProject(projectId, client);
        log.info("Client with ID {} successfully got all applications to project with ID {}.{} returned", client.getId(), projectId, applications.size());
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/applications/{applicationId}/select-freelancer")
    @Operation(
            summary = "Select a freelancer for a project",
            description = "Select a freelancer for a project by passing the application ID"
    )
    public ResponseEntity<String> selectFreelancer(@PathVariable(name = "applicationId") UUID applicationId) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to select a freelancer for application with ID {}", client.getId(), applicationId);
        applicationProcessWorkflow.selectFreelancer(applicationId, client);
        log.info("Client with ID {} successfully selected a freelancer for application with ID {}", client.getId(), applicationId);
        return ResponseEntity.ok("Freelancer selected successfully");
    }

    @PostMapping("/applications/{applicationId}/reject-freelancer")
    @Operation(
            summary = "Reject a freelancer for a project",
            description = "Reject a freelancer for a project by passing the application ID"
    )
    public ResponseEntity<String> rejectFreelancer(@PathVariable(name = "applicationId") UUID applicationId) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to reject freelancer for application with ID {}", client.getId(), applicationId);
        applicationProcessWorkflow.rejectApplication(applicationId, client);
        log.info("Client with ID {} successfully rejected freelancer for application with ID {}", client.getId(), applicationId);
        return ResponseEntity.ok("Freelancer rejected successfully");
    }

    @PostMapping("/applications/bulk/reject-freelancer")
    @Operation(
            summary = "Reject many freelancers for a project",
            description = "Reject many freelancers for a project by passing a list of ids"
    )
    public ResponseEntity<String> rejectManyFreelancers(@RequestBody List<UUID> applicationIds) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to reject many freelancers for applications with ids {}", client.getId(), applicationIds);
        applicationProcessWorkflow.rejectManyApplications(applicationIds, client);
        log.info("Client with ID {} successfully rejected many freelancers for applications with ids {}", client.getId(), applicationIds);
        return ResponseEntity.ok("All selected freelancers rejected successfully");
    }

    @GetMapping("/freelancers/all")
    @Operation(
            summary = "View all available freelancers.",
            description = "View all freelancers (as a client) based on the provided filters."
    )
    public ResponseEntity<PageResponseDto<FreelancerProfileDto>> getAllAvailableFreelancers(
            @Valid PageableRequestDto pageableRequest,
            @Valid FreelancerProfileFilterDto filters) {
        User client = SecurityUtil.getAuthenticatedUser();
        log.info("Client with ID {} attempting to get all available freelancers from repository", client.getId());
        Page<FreelancerProfileDto> freelancersPage = clientWorkflowService.getAllAvailableFreelancers(
                pageableRequest.toPageRequest(),
                filters
        );
        log.info("Client with ID {} successfully got all available freelancers from repository", client.getId());
        return ResponseEntity.ok(new PageResponseDto<>(freelancersPage));
    }

}
