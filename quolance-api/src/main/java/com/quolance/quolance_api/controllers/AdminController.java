package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.business_workflow.AdminWorkflowService;
import com.quolance.quolance_api.util.PaginationUtils;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@Slf4j
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
        User admin = SecurityUtil.getAuthenticatedUser();
        log.info("Admin with ID {} attempting to get all pending projects", admin.getId());
        Page<ProjectDto> pendingProjects = adminWorkflowService.getAllPendingProjects(paginationUtils.createPageable(pageableRequest));
        log.info("Admin with ID {} successfully got all pending projects", admin.getId());
        return ResponseEntity.ok(pendingProjects);
    }

    @Operation(
            summary = "Approve a pending project"
    )
    @PostMapping("projects/pending/{projectId}/approve")
    public ResponseEntity<String> approveProject(@PathVariable(name = "projectId") UUID projectId) {
        User admin = SecurityUtil.getAuthenticatedUser();
        log.info("Admin with ID {} attempting to approve pending project {}", admin.getId(), projectId);
        adminWorkflowService.approveProject(projectId);
        log.info("Admin with ID {} successfully approved pending project {}", admin.getId(), projectId);
        return ResponseEntity.ok("Project approved successfully");
    }

    @Operation(
            summary = "Reject a pending project"
    )
    @PostMapping("projects/pending/{projectId}/reject")
    public ResponseEntity<String> rejectProject(@PathVariable(name = "projectId") UUID projectId) {
        User admin = SecurityUtil.getAuthenticatedUser();
        log.info("Admin with ID {} attempting to reject pending project {}", admin.getId(), projectId);
        adminWorkflowService.rejectProject(projectId);
        log.info("Admin with ID {} successfully rejected pending project {}", admin.getId(), projectId);

        return ResponseEntity.ok("Project rejected successfully");

    }

}
