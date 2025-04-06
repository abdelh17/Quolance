package com.quolance.quolance_api.services.entity_services.blog;

import com.quolance.quolance_api.dtos.blog.BlogFilterRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface BlogPostService {

    BlogPostResponseDto create(@Valid BlogPostRequestDto request, User author);

    List<BlogPostResponseDto> getAll();

    BlogPost getBlogPostEntity(UUID id);

    List<BlogPostResponseDto> getBlogPostsByUserId(UUID userId);

    BlogPostResponseDto update(BlogPostUpdateDto request, User author);

    void deletePost(UUID id, User author);

    BlogPostResponseDto getBlogPost(UUID id);

    Set<String> updateTagsForPost(UUID postId, List<String> tagNames);

    Page<BlogPostResponseDto> getPaginatedBlogPosts(Pageable pageable);

    Page<BlogPostResponseDto> getFilteredPosts(BlogFilterRequestDto filterDto, Pageable pageable);

    BlogPostResponseDto reportPost(UUID postId, User user);

    Page<BlogPostResponseDto> getReportedPosts(Pageable pageable);
    Page<BlogPostResponseDto> getPreviouslyResolvedPosts(Pageable pageable);

    void keepReportedPost(UUID postId);

    void deleteReportedPost(UUID postId);

    List<BlogPost> getPostsByUserId(UUID userId);

}