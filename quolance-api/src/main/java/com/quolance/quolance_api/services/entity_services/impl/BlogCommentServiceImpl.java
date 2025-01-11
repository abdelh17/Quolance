// BlogCommentServiceImpl
package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.BlogCommentDto;
import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.BlogCommentRepository;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.entity_services.BlogCommentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogCommentServiceImpl implements BlogCommentService {

        private final BlogCommentRepository blogCommentRepository;
        private final BlogPostRepository blogPostRepository;
        private final UserRepository userRepository;

        @Override
        public BlogCommentDto createBlogComment(Long blogPostId, Long userId, BlogCommentDto blogCommentDto) {
                BlogPost blogPost = blogPostRepository.findById(blogPostId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "BlogPost not found with ID: " + blogPostId));

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

                // Pass the BlogPost and User entities to the toEntity() method
                BlogComment blogComment = blogCommentDto.toEntity(blogPost, user);

                BlogComment savedComment = blogCommentRepository.save(blogComment);
                return BlogCommentDto.fromEntity(savedComment);
        }

        @Override
        public BlogCommentDto updateBlogComment(Long commentId, BlogCommentDto blogCommentDto) {
                BlogComment blogComment = blogCommentRepository.findById(commentId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "BlogComment not found with ID: " + commentId));

                blogComment.setContent(blogCommentDto.getContent()); // Update content
                BlogComment updatedComment = blogCommentRepository.save(blogComment);

                return BlogCommentDto.fromEntity(updatedComment);
        }

        @Override
        public void deleteBlogComment(Long commentId) {
                BlogComment blogComment = blogCommentRepository.findById(commentId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "BlogComment not found with ID: " + commentId));

                blogCommentRepository.delete(blogComment);
        }

        @Override
        public BlogCommentDto getBlogCommentById(Long commentId) {
                BlogComment blogComment = blogCommentRepository.findById(commentId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "BlogComment not found with ID: " + commentId));

                return BlogCommentDto.fromEntity(blogComment);
        }

        @Override
        public List<BlogCommentDto> getCommentsByBlogPostId(Long blogPostId) {
                BlogPost blogPost = blogPostRepository.findById(blogPostId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "BlogPost not found with ID: " + blogPostId));

                List<BlogComment> comments = blogCommentRepository.findByBlogPost(blogPost);

                return comments.stream()
                                .map(BlogCommentDto::fromEntity)
                                .collect(Collectors.toList());
        }
}
