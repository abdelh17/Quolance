package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.AdminWorkflowService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminWorkflowServiceImpl implements AdminWorkflowService {
    private final ProjectService projectService;
    private final BlogPostService blogPostService;

    @Override
    public Page<ProjectDto> getAllPendingProjects(Pageable pageable) {
        return projectService.getProjectsByStatuses(List.of(ProjectStatus.PENDING), pageable)
                .map(ProjectDto::fromEntity);
    }

    @Override
    public void approveProject(UUID projectId) {
        projectService.updateProjectStatus(projectService.getProjectById(projectId), ProjectStatus.OPEN);
    }

    @Override
    public void rejectProject(UUID projectId, String rejectionReason) {
        projectService.updateProjectStatus(projectService.getProjectById(projectId), ProjectStatus.REJECTED);
        projectService.setProjectRejectionReason(projectService.getProjectById(projectId), rejectionReason);
    }

    @Override
    public Page<BlogPostResponseDto> getAllReportedBlogPosts(Pageable pageable) {
        return blogPostService.getReportedPosts(pageable);
    }

    @Override
    public Page<BlogPostResponseDto> getAllPreviouslyResolvedBlogPosts(Pageable pageable) {
        return blogPostService.getPreviouslyResolvedPosts(pageable);
    }

    @Override
    public void keepReportedBlogPost(UUID postId) {
        blogPostService.keepReportedPost(postId);
    }

    @Override
    public void deleteReportedBlogPost(UUID postId) {
        blogPostService.deleteReportedPost(postId);
    }
}
