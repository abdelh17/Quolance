package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.blog.BlogThreadViewRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogThreadViewResponseDto;
import com.quolance.quolance_api.dtos.blog.UpdateBlogThreadViewTitleDto;

public interface BlogThreadViewService {
    BlogThreadViewResponseDto create(BlogThreadViewRequestDto request);
    BlogThreadViewResponseDto getBlogThreadById(Long id);
    BlogThreadViewResponseDto getThreadViewByBlogPostId(Long blogPostId);
    BlogThreadViewResponseDto update(Long id, UpdateBlogThreadViewTitleDto request);
    void delete(Long id);
}
