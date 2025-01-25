package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.blog.BlogTagDto;

import java.util.List;

public interface BlogTagService {
    BlogTagDto createTag(BlogTagDto tagDto);
    List<BlogTagDto> getAllTags();
}
