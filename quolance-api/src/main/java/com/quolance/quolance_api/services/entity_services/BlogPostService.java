package com.quolance.quolance_api.services.entity_services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.entities.BlogPost;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

public interface BlogPostService {

    BlogPostResponseDto create(@Valid BlogPostRequestDto request);

    List<BlogPostResponseDto> getAll();

    Optional<BlogPost> findById(Long id);

    List<BlogPostResponseDto> getBlogPostsByUserId(Long userId);

    BlogPostResponseDto update(Long id, @Valid BlogPostRequestDto request);

    void delete(Long id);

    BlogPostResponseDto mapToResponseDto(BlogPost blogPost);

    Page<BlogPostResponseDto> getPaginatedBlogPosts(Pageable pageable);
}