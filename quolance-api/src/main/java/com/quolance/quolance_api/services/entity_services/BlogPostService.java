package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.User;
import jakarta.validation.Valid;

import java.util.List;

public interface BlogPostService {

    BlogPostResponseDto create(@Valid BlogPostRequestDto request, User author);

    List<BlogPostResponseDto> getAll();

    BlogPost getBlogPostEntity(Long id);

    List<BlogPostResponseDto> getBlogPostsByUserId(Long userId);

    BlogPostResponseDto update(BlogPostUpdateDto request, User author);

    void deletePost(Long id, User author);

    BlogPostResponseDto getBlogPost(Long id);
}