package com.quolance.quolance_api.services.entity_services.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogCommentService {

    BlogCommentDto createBlogComment(UUID blogPostId, User author, BlogCommentDto blogCommentDto);

    BlogCommentDto updateBlogComment(UUID commentId, BlogCommentDto blogCommentDto, User author);

    void deleteBlogComment(UUID commentId, User author);

    BlogComment getBlogCommentEntity(UUID blogCommentId);

    Page<BlogCommentDto> getPaginatedComments(UUID blogPostId, Pageable pageable);

    List<BlogCommentDto> getCommentsByBlogPostId(UUID blogPostId);
}