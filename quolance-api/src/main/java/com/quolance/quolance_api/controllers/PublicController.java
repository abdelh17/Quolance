package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.services.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    private final ProjectService projectService;


    @GetMapping("/projects/all")
    @Operation(summary = "View all projects as a guest.")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        //TO-DO (security) remove ClientId from ProjectDto (This is a public endpoint)
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/projects/{projectId}")
    @Operation(summary = "View a project as a guest.")
    public ResponseEntity<ProjectDto> getProject(@PathVariable Long projectId) {
        //TO-DO (security) remove ClientId from ProjectDto (This is a public endpoint)
        ProjectDto project = projectService.getProjectById(projectId);
        return ResponseEntity.ok(project);
    }

}

