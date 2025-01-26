package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.services.business_workflow.AdminWorkflowService;
import com.quolance.quolance_api.util.PaginationUtils;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminWorkflowService adminWorkflowService;
    private final PaginationUtils paginationUtils;

    @Operation(
            summary = "Get all pending projects"
    )
    @GetMapping("projects/pending/all")
    public ResponseEntity<Page<ProjectDto>> getAllPendingProjects(
            @Valid PageableRequestDto pageableRequest
    ) {
        Page<ProjectDto> pendingProjects = adminWorkflowService.getAllPendingProjects(paginationUtils.createPageable(pageableRequest));
        return ResponseEntity.ok(pendingProjects);
    }

    @Operation(
            summary = "Approve a pending project"
    )
    @PostMapping("projects/pending/{projectId}/approve")
    public ResponseEntity<String> approveProject(@PathVariable(name = "projectId") Long projectId) {
        adminWorkflowService.approveProject(projectId);
        return ResponseEntity.ok("Project approved successfully");
    }

    @Operation(
            summary = "Reject a pending project"
    )
    @PostMapping("projects/pending/{projectId}/reject")
    public ResponseEntity<String> rejectProject(@PathVariable(name = "projectId") Long projectId) {
        adminWorkflowService.rejectProject(projectId);
        return ResponseEntity.ok("Project rejected successfully");
    }

}
