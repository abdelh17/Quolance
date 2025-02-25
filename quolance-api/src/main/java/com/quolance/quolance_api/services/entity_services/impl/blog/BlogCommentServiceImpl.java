package com.quolance.quolance_api.services.entity_services.impl.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.repositories.blog.BlogCommentRepository;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BlogCommentServiceImpl implements BlogCommentService {

    private final BlogCommentRepository blogCommentRepository;
    private final BlogPostService blogPostService;

    @Override
    public BlogCommentDto createBlogComment(UUID blogPostId, User author, BlogCommentDto blogCommentDto) {
        log.info("Creating a new comment for blog post ID: {} by user ID: {}", blogPostId, author.getId());
        BlogPost blogPost = blogPostService.getBlogPostEntity(blogPostId);

        if (blogCommentDto.getContent() == null || blogCommentDto.getContent().isEmpty()) {
            log.warn("Attempted to create an empty comment for blog post ID: {}", blogPostId);
            throw new ApiException("Comment content cannot be empty");
        }
        BlogComment blogComment = BlogCommentDto.toEntity(blogCommentDto);
        blogComment.setBlogPost(blogPost);
        blogComment.setUser(author);

        BlogComment savedComment = blogCommentRepository.save(blogComment);
        return BlogCommentDto.fromEntity(savedComment);
    }

    @Override
    public BlogCommentDto updateBlogComment(UUID commentId, BlogCommentDto blogCommentDto, User author) {
        log.info("Updating comment ID: {} by user ID: {}", commentId, author.getId());
        BlogComment blogComment = getBlogCommentEntity(commentId);

        if (!isAuthorOfPost(blogComment, author)) {
            log.warn("User ID: {} attempted to update a comment they do not own (comment ID: {})", author.getId(),
                    commentId);
            throw new ApiException("You cannot update a comment that does not belong to you.");
        }

        blogComment.setContent(blogCommentDto.getContent());
        BlogComment updatedComment = blogCommentRepository.save(blogComment);

        return BlogCommentDto.fromEntity(updatedComment);
    }

    @Override
    public void deleteBlogComment(UUID commentId, User author) {
        log.info("Deleting comment ID: {} by user ID: {}", commentId, author.getId());
        BlogComment blogComment = getBlogCommentEntity(commentId);

        if (!isAuthorOfPost(blogComment, author)) {
            log.warn("User ID: {} attempted to delete a comment they do not own (comment ID: {})", author.getId(),commentId);
            throw new ApiException("You cannot delete a comment that does not belong to you.");
        }

        blogCommentRepository.delete(blogComment);
        log.info("Successfully deleted comment ID: {}", commentId);
    }

    @Override
    public List<BlogCommentDto> getCommentsByBlogPostId(UUID blogPostId) {
        log.info("Fetching comments for blog post ID: {}", blogPostId);
        BlogPost blogPost = blogPostService.getBlogPostEntity(blogPostId);

        List<BlogComment> comments = blogCommentRepository.findByBlogPost(blogPost);
        log.info("Found {} comments for blog post ID: {}", comments.size(), blogPostId);

        return comments.stream()
                .map(BlogCommentDto::fromEntity)
                .toList();
    }

    private boolean isAuthorOfPost(BlogComment blogComment, User author) {
        return blogComment.getUser().getId().equals(author.getId());
    }

    public BlogComment getBlogCommentEntity(UUID commentId) {
        log.info("Fetching comment entity for ID: {}", commentId);
        BlogComment blogComment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> {
                    log.warn("BlogComment not found with ID: {}", commentId);
                    return new EntityNotFoundException("BlogComment not found with ID: " + commentId);
                });

        log.info("Successfully fetched comment entity for ID: {}", commentId);
        return blogComment;
    }

    @Override
    public Page<BlogCommentDto> getPaginatedComments(UUID blogPostId, Pageable pageable) {
        log.info("Fetching paginated comments for blog post ID: {}", blogPostId);
        Page<BlogCommentDto> paginatedComments = blogCommentRepository.findByBlogPostId(blogPostId, pageable)
                .map(BlogCommentDto::fromEntity);
        log.info("Fetched {} comments for blog post ID: {}", paginatedComments.getTotalElements(), blogPostId);
        return paginatedComments;
    }
}
