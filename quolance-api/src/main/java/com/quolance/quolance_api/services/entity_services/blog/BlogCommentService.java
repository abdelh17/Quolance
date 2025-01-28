package com.quolance.quolance_api.services.entity_services.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;

import java.util.List;
import java.util.UUID;

public interface BlogCommentService {

    BlogCommentDto createBlogComment(UUID blogPostId, User author, BlogCommentDto blogCommentDto);

    BlogCommentDto updateBlogComment(UUID commentId, BlogCommentDto blogCommentDto);

    void deleteBlogComment(UUID commentId);

    List<BlogCommentDto> getCommentsByBlogPostId(UUID blogPostId);

    BlogComment getBlogCommentEntity(UUID blogCommentId);
}