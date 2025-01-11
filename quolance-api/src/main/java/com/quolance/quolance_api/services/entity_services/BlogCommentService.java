// BlogCommentService Interface
package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.BlogCommentDto;
import java.util.List;

public interface BlogCommentService {

    BlogCommentDto createBlogComment(Long blogPostId, Long userId, BlogCommentDto blogCommentDto);

    BlogCommentDto updateBlogComment(Long commentId, BlogCommentDto blogCommentDto);

    void deleteBlogComment(Long commentId);

    BlogCommentDto getBlogCommentById(Long commentId);

    List<BlogCommentDto> getCommentsByBlogPostId(Long blogPostId);
}