package com.quolance.quolance_api.services.entity_services.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;

import java.util.List;

public interface BlogCommentService {

    BlogCommentDto createBlogComment(Long blogPostId, User author, BlogCommentDto blogCommentDto);

    BlogCommentDto updateBlogComment(Long commentId, BlogCommentDto blogCommentDto, User author);

    void deleteBlogComment(Long commentId, User author);

    List<BlogCommentDto> getCommentsByBlogPostId(Long blogPostId);

    BlogComment getBlogCommentEntity(Long blogCommentId);
}