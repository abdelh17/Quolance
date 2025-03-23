package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminWorkflowService {
    Page<ProjectDto> getAllPendingProjects(Pageable pageable);

    void approveProject(UUID projectId);

    void rejectProject(UUID projectId, String rejectionReason);

    Page<BlogPostResponseDto> getAllReportedBlogPosts(Pageable pageable);
    Page<BlogPostResponseDto> getAllPreviouslyResolvedBlogPosts(Pageable pageable);

    void keepReportedBlogPost(UUID postId);
    void deleteReportedBlogPost(UUID postId);
}
