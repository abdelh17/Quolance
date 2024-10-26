package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.services.ProjectService;
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
    public ResponseEntity<ApplicationDto> createProject(@RequestBody ApplicationDto applicationDto) {
        ApplicationDto application = freelancerService.submitApplication(applicationDto);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/applications/freelancer/{id}")
    public ResponseEntity<List<ApplicationDto>> getAllMyApplications(@PathVariable(name = "id") Long freelancerId) {
        List<ApplicationDto> applications = freelancerService.getMyApplications(freelancerId);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projects = freelancerService.getAllAvailableProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        ProjectDto project = freelancerService.getProjectById(id);
        return ResponseEntity.ok(project);
    }
}