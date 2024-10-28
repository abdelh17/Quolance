package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;
    private final ApplicationService applicationService;

    @PostMapping("/create-project")
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        ProjectDto project = clientService.createProject(projectDto);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/client/{id}/projects")
    public ResponseEntity<List<ProjectDto>> getAllMyProjects(@PathVariable(name = "id") Long clientId) {
        List<ProjectDto> projects = clientService.getMyProjects(clientId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{id}/applications")
    public ResponseEntity<List<ApplicationDto>> getAllApplicationsToProject(@PathVariable(name = "id") Long projectId) {
        List<ApplicationDto> applications = applicationService.getApplicationsByProjectId(projectId);
        return ResponseEntity.ok(applications);
    }
}
