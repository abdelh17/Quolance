package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.dtos.RejectProjectRequestDto;
import com.quolance.quolance_api.services.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    @Operation(
            summary = "Approve a pending project"
    )
    @PostMapping("/pending-projects/{projectId}/approve")
    public ResponseEntity<ProjectDto> approveProject(@PathVariable(name = "projectId") Long projectId) {

        return ResponseEntity.ok(adminService.approveProject(projectId));
    }

    @Operation(
            summary = "Reject a pending project"
    )
    @PostMapping("/pending-projects/reject")
    public ResponseEntity<ProjectDto> rejectProject(@RequestBody RejectProjectRequestDto rejectProjectRequestDto) {

        return ResponseEntity.ok(adminService.rejectProject(rejectProjectRequestDto));
    }

    @Operation(
            summary = "Get all pending projects"
    )
    @GetMapping("/pending-projects")
    public ResponseEntity<List<ProjectDto>> getAllPendingProjects() {
        return ResponseEntity.ok(adminService.getAllPendingProjects());
    }

}
