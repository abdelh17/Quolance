package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;

import java.util.List;

public interface BlogCommentService {

    BlogComment getCommentEntity(Long commentId);

    BlogCommentDto createBlogComment(Long blogPostId, User author, BlogCommentDto blogCommentDto);

    BlogCommentDto updateBlogComment(Long commentId, BlogCommentDto blogCommentDto);

    void deleteBlogComment(Long commentId);

    List<BlogCommentDto> getCommentsByBlogPostId(Long blogPostId);
}