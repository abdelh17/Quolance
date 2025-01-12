package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.BlogCommentDto;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.entity_services.BlogPostService;
import com.quolance.quolance_api.util.SecurityUtil;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;

    @Override
    public BlogPostResponseDto create(@Valid BlogPostRequestDto request) {
        // Fetch user
        User user = SecurityUtil.getAuthenticatedUser();

        // Create and save the blog post
        BlogPost blogPost = BlogPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .build();

        BlogPost savedBlogPost = blogPostRepository.save(blogPost);

        // Return response DTO
        return mapToResponseDto(savedBlogPost);
    }

    @Override
    public List<BlogPostResponseDto> getAll() {
        return blogPostRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<BlogPost> findById(Long id) {
        return blogPostRepository.findById(id);
    }

    @Override
    public List<BlogPostResponseDto> getBlogPostsByUserId(Long userId) {
        // Fetch all blog posts for the given user ID
        List<BlogPost> blogPosts = blogPostRepository.findByUserId(userId);

        // Map blog posts to response DTOs
        return blogPosts.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public BlogPostResponseDto update(Long id, @Valid BlogPostRequestDto request) {
        // Fetch the existing blog post
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ApiException("Blog post not found"));

        // Update the blog post fields
        blogPost.setContent(request.getContent());

        blogPost.setTitle(request.getTitle());

        // Save the updated blog post
        BlogPost updatedBlogPost = blogPostRepository.save(blogPost);

        // Return response DTO
        return mapToResponseDto(updatedBlogPost);
    }

    @Override
    public void delete(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ApiException("Blog post not found"));
        Long authenticatedUserId = SecurityUtil.getAuthenticatedUser().getId(); // Assuming this method exists

        if (!blogPost.getUser().getId().equals(authenticatedUserId)) {
            throw new ApiException("Incorrect User. Cannot delete");
        }
        blogPostRepository.deleteById(id);
    }

    @Override
    public BlogPostResponseDto mapToResponseDto(BlogPost blogPost) {
        List<BlogCommentDto> commentDtos = blogPost.getBlogComments().stream()
                .map(BlogCommentDto::fromEntity)
                .collect(Collectors.toList());

        return new BlogPostResponseDto(
                blogPost.getId(),
                blogPost.getTitle(),
                blogPost.getContent(),
                blogPost.getUser().getFirstName() + " " + blogPost.getUser().getLastName(),
                blogPost.getCreationDate(),
                commentDtos);
        // blogPost.getTags().stream().map(Tag::getName).collect(Collectors.toList()),
        // // Empty if no tags
        // new ArrayList<>(), // Placeholder for reactions
        // new ArrayList<>() // Placeholder for replies
    }

    @Override
    public Page<BlogPostResponseDto> getPaginatedBlogPosts(Pageable pageable) {
        // Fetch paginated blog posts
        Page<BlogPost> blogPosts = blogPostRepository.findAll(pageable);

        // Map to response DTOs with truncated content
        return blogPosts.map(blogPost -> new BlogPostResponseDto(
                blogPost.getId(),
                blogPost.getTitle(),
                blogPost.getContent().length() > 100 ? blogPost.getContent().substring(0, 100) + "..."
                        : blogPost.getContent(),
                blogPost.getUser().getFirstName() + " " + blogPost.getUser().getLastName(),
                blogPost.getCreationDate(),
                blogPost.getBlogComments().stream()
                        .map(BlogCommentDto::fromEntity) // Convert each comment to a BlogCommentDto
                        .collect(Collectors.toList()) // Collect all comments
        ));
    }
}