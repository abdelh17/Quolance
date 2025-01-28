package com.quolance.quolance_api.services.entity_services.blog;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;
import jakarta.validation.Valid;

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
}