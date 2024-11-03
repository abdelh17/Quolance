package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ClientService;
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
    private final ClientService clientService;

    @PostMapping("/create-project")
    @Operation(
            summary = "Create a project",
            description = "Create a project by passing a project dto"
    )
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        User client = SecurityUtil.getAuthenticatedUser();
        ProjectDto project = clientService.createProject(projectDto, client);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/projects")
    @Operation(summary = "Get all projects of a client")
    public ResponseEntity<List<ProjectDto>> getAllMyProjects() {
        User client = SecurityUtil.getAuthenticatedUser();
        List<ProjectDto> projects = clientService.getProjectsByClientId(client.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{projectId}/applications")
    @Operation(
            summary = "Get all applications on a project",
            description = "Get all applications on a project by passing the project ID"
    )
    public ResponseEntity<List<ApplicationDto>> getAllApplicationsToProject(@PathVariable(name = "projectId") Long projectId) {
        User client = SecurityUtil.getAuthenticatedUser();
        List<ApplicationDto> applications = clientService.getApplicationsByProjectId(projectId, client.getId());
        return ResponseEntity.ok(applications);
    }
}
