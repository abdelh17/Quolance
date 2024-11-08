package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Application;
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
            description = "Create a new application on a project by passing an ApplicationCreateDto"
    )
    public ResponseEntity<ApplicationDto> applyToProject(@RequestBody ApplicationCreateDto applicationCreateDto) {
        User freelancer = SecurityUtil.getAuthenticatedUser();
        ApplicationDto applicationDto = freelancerService.submitApplication(applicationCreateDto, freelancer);
        return ResponseEntity.ok(applicationDto);
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
}