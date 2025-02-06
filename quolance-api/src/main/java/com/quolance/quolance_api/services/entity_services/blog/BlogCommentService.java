package com.quolance.quolance_api.services.entity_services.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogCommentService {

    BlogCommentDto createBlogComment(Long blogPostId, User author, BlogCommentDto blogCommentDto);

    BlogCommentDto updateBlogComment(Long commentId, BlogCommentDto blogCommentDto);

    void deleteBlogComment(Long commentId);

    List<BlogCommentDto> getCommentsByBlogPostId(Long blogPostId);

    BlogComment getBlogCommentEntity(Long blogCommentId);

    Page<BlogCommentDto> getPaginatedComments(Long blogPostId, Pageable pageable);
}