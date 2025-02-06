package com.quolance.quolance_api.services.entity_services.blog;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface BlogPostService {

    BlogPostResponseDto create(@Valid BlogPostRequestDto request, User author);

    List<BlogPostResponseDto> getAll();

    BlogPost getBlogPostEntity(Long id);

    List<BlogPostResponseDto> getBlogPostsByUserId(Long userId);

    BlogPostResponseDto update(BlogPostUpdateDto request, User author);

    void deletePost(Long id, User author);

    BlogPostResponseDto getBlogPost(Long id);

    Set<String> updateTagsForPost(Long postId, List<String> tagNames);

    Page<BlogPostResponseDto> getPaginatedBlogPosts(Pageable pageable);
}