package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.services.ProjectService;
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
    private final ProjectService projectService;

    @PostMapping("/submit-application")
    @Operation(
            summary = "Create a new application on a project.",
            description = "Create a new application on a project by passing an ApplicationDto"
    )
    public ResponseEntity<ApplicationDto> createProject(@RequestBody ApplicationDto applicationDto) {
        ApplicationDto application = freelancerService.submitApplication(applicationDto);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{freelancerId}/applications")
    @Operation(
            summary = "View all the application of a freelancer.",
            description = "View all the application of a freelancer by passing the freelancer id."
    )
    public ResponseEntity<List<ApplicationDto>> getAllMyApplications(@PathVariable(name = "freelancerId") Long freelancerId) {
        List<ApplicationDto> applications = freelancerService.getMyApplications(freelancerId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/projects")
    @Operation(
            summary = "View all projects.",
            description = "View all projects."
    )
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