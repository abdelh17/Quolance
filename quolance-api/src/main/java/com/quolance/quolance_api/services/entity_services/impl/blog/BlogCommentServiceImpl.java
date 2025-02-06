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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogCommentServiceImpl implements BlogCommentService {

    private final BlogCommentRepository blogCommentRepository;
    private final BlogPostService blogPostService;

    @Override
    public BlogCommentDto createBlogComment(Long blogPostId, User author, BlogCommentDto blogCommentDto) {
        BlogPost blogPost = blogPostService.getBlogPostEntity(blogPostId);

        if (blogCommentDto.getContent() == null || blogCommentDto.getContent().isEmpty()) {
            throw new ApiException("Comment content cannot be empty");
        }
        BlogComment blogComment = BlogCommentDto.toEntity(blogCommentDto);
        blogComment.setBlogPost(blogPost);
        blogComment.setUser(author);

        BlogComment savedComment = blogCommentRepository.save(blogComment);
        return BlogCommentDto.fromEntity(savedComment);
    }

    @Override
    public BlogCommentDto updateBlogComment(Long commentId, BlogCommentDto blogCommentDto) {
        BlogComment blogComment = getBlogCommentEntity(commentId);

        blogComment.setContent(blogCommentDto.getContent());
        BlogComment updatedComment = blogCommentRepository.save(blogComment);

        return BlogCommentDto.fromEntity(updatedComment);
    }

    @Override
    public void deleteBlogComment(Long commentId) {
        BlogComment blogComment = getBlogCommentEntity(commentId);

        blogCommentRepository.delete(blogComment);
    }

    @Override
    public List<BlogCommentDto> getCommentsByBlogPostId(Long blogPostId) {
        BlogPost blogPost = blogPostService.getBlogPostEntity(blogPostId);

        List<BlogComment> comments = blogCommentRepository.findByBlogPost(blogPost);

        return comments.stream()
                .map(BlogCommentDto::fromEntity)
                .toList();
    }

    public BlogComment getBlogCommentEntity(Long commentId) {
        BlogComment blogComment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "BlogComment not found with ID: " + commentId));

        return blogComment;
    }

    public Page<BlogCommentDto> getPaginatedComments(Long blogPostId, Pageable pageable) {
        return blogCommentRepository.findByBlogPostId(blogPostId, pageable)
                .map(BlogCommentDto::fromEntity);
    }
}
