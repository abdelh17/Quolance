package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.paging.PageResponseDto;
import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.profile.UpdateFreelancerProfileDto;
import com.quolance.quolance_api.dtos.project.ProjectFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
import com.quolance.quolance_api.util.PaginationUtils;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/freelancer")
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerWorkflowService freelancerWorkflowService;
    private final ApplicationProcessWorkflow applicationProcessWorkflow;
    private final PaginationUtils paginationUtils;

    @PostMapping("/submit-application")
    @Operation(
            summary = "Create a new application on a project.",
            description = "Create a new application on a project by passing an ApplicationCreateDto"
    )
    public void applyToProject(@RequestBody ApplicationCreateDto applicationCreateDto) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to apply to project with ID", freelancer.getId());
        freelancerWorkflowService.submitApplication(applicationCreateDto, freelancer);
    }

    @GetMapping("/applications/{applicationId}")
    @Operation(
            summary = "View an application.",
            description = "View an application by passing the application ID."
    )
    public ResponseEntity<ApplicationDto> getApplication(@PathVariable(name = "applicationId") Long applicationId) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to get application with ID {}", freelancer.getId(), applicationId);
        ApplicationDto application = freelancerWorkflowService.getApplication(applicationId, freelancer);
        log.info("Freelancer with ID {} successfully got application with ID {}", freelancer.getId(), applicationId);
        return ResponseEntity.ok(application);
    }

    @DeleteMapping("/applications/{applicationId}")
    @Operation(
            summary = "Delete an application.",
            description = "Delete an application by passing the application ID."
    )
    public ResponseEntity<String> deleteApplication(@PathVariable(name = "applicationId") Long applicationId) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to delete application with ID {}", freelancer.getId(), applicationId);
        applicationProcessWorkflow.cancelApplication(applicationId, freelancer);
        log.info("Freelancer with ID {} successfully deleted application with ID {}", freelancer.getId(), applicationId);
        return ResponseEntity.ok("Application deleted successfully.");
    }

    @GetMapping("/applications/all")
    @Operation(
            summary = "View all the application of a freelancer.",
            description = " "
    )
    public ResponseEntity<PageResponseDto<ApplicationDto>> getAllFreelancerApplications(@Valid PageableRequestDto pageableRequest) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to get all his applications", freelancer.getId());
        Page<ApplicationDto> applications = freelancerWorkflowService.getAllFreelancerApplications(freelancer, paginationUtils.createPageable(pageableRequest));
        log.info("Freelancer with ID {} successfully got all his applications. {} returned", freelancer.getId(), applications.getTotalElements());
        return ResponseEntity.ok(new PageResponseDto<>(applications));
    }

    @GetMapping("/projects/all")
    @Operation(
            summary = "View all available projects.",
            description = "View all projects that are open or closed and still in the visibility of the freelancer."
    )
    public ResponseEntity<PageResponseDto<ProjectPublicDto>> getAllVisibleProjects(
            @Valid PageableRequestDto pageableRequest,
            @Valid ProjectFilterDto filters) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to get all available projects", freelancer.getId());
        Page<ProjectPublicDto> availableProjects = freelancerWorkflowService.getAllVisibleProjects(
                paginationUtils.createPageable(pageableRequest),
                filters
        );
        log.info("Freelancer with ID {} successfully got all available projects. {} returned", freelancer.getId(), availableProjects.getTotalElements());
        return ResponseEntity.ok(new PageResponseDto<>(availableProjects));
    }

    @GetMapping("/projects/{projectId}")
    @Operation(
            summary = "View a project.",
            description = "View a project by passing the project ID."
    )
    public ResponseEntity<ProjectPublicDto> getProjectById(@PathVariable(name = "projectId") Long projectId) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to get project with ID {}", freelancer.getId(), projectId);
        ProjectPublicDto project = freelancerWorkflowService.getProject(projectId);
        log.info("Freelancer with ID {} successfully got project with ID {}", freelancer.getId(), projectId);
        return ResponseEntity.ok(project);
    }

    @PutMapping("/profile")
    @Operation(
            summary = "Update freelancer profile",
            description = "Update freelancer profile information including personal details and preferences"
    )
    public ResponseEntity<String> updateFreelancerProfile(@RequestBody UpdateFreelancerProfileDto updateFreelancerProfileDto) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to update profile", freelancer.getId());
        freelancerWorkflowService.updateFreelancerProfile(updateFreelancerProfileDto, freelancer);
        log.info("Freelancer with ID {} successfully updated profile", freelancer.getId());
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PostMapping("/profile/picture")
    @Operation(
            summary = "Upload profile picture",
            description = "Upload a profile picture for the authenticated freelancer"
    )
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("photo") MultipartFile photo) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        log.info("Freelancer with ID {} attempting to upload profile picture", freelancer.getId());
        freelancerWorkflowService.uploadProfilePicture(photo, freelancer);
        log.info("Freelancer with ID {} successfully uploaded profile picture", freelancer.getId());
        return ResponseEntity.ok("Profile picture uploaded successfully");
    }

}