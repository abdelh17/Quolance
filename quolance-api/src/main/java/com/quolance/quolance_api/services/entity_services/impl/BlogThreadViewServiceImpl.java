package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.blog.BlogThreadViewRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogThreadViewResponseDto;
import com.quolance.quolance_api.dtos.blog.UpdateBlogThreadViewTitleDto;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.BlogThreadView;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.BlogThreadViewRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.entity_services.BlogThreadViewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class BlogThreadViewServiceImpl implements BlogThreadViewService {

    private final BlogThreadViewRepository blogThreadViewRepository;
    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;

    @Override
    public BlogThreadViewResponseDto create(BlogThreadViewRequestDto request) {
        // Fetch the user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create the BlogPost
        BlogPost blogPost = BlogPost.builder()
                .content(request.getContent())
                .user(user)
                .build();
        BlogPost savedBlogPost = blogPostRepository.save(blogPost);

        // Derive the title from the first 50 characters of the BlogPost content
        String shortenedContent = request.getContent().length() > 75
                ? request.getContent().substring(0, 75)
                : request.getContent();

        // Create the BlogThreadView associated with the BlogPost
        BlogThreadView threadView = BlogThreadView.builder()
                .title(request.getContent())
                .content(shortenedContent)
                .dateCreated(savedBlogPost.getDateCreated()) // Match the blog post's date
                .blogPost(savedBlogPost)
                .build();
        BlogThreadView savedThreadView = blogThreadViewRepository.save(threadView);

        // Return the response DTO
        return mapToResponseDto(savedThreadView);
    }

    private BlogThreadViewResponseDto mapToResponseDto(BlogThreadView threadView) {
        return new BlogThreadViewResponseDto(
                threadView.getId(),
                threadView.getTitle(),
                threadView.getBlogPost().getId(),
                threadView.getDateCreated()
        );
    }

    @Override
    public Page<BlogThreadViewResponseDto> getAll(Pageable pageable) {
        Page<BlogThreadView> threadViews = blogThreadViewRepository.findAll(pageable);
        return threadViews.map(this::mapToResponseDto);
    }

    @Override
    public BlogThreadViewResponseDto getBlogThreadById(Long id) {
        BlogThreadView threadView = blogThreadViewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog thread view not found"));
        return mapToResponseDto(threadView);
    }

    @Override
    public BlogThreadViewResponseDto getThreadViewByBlogPostId(Long blogPostId) {
        // Find the BlogThreadView associated with the given BlogPost ID
        BlogThreadView threadView = blogThreadViewRepository.findByBlogPostId(blogPostId)
                .orElseThrow(() -> new RuntimeException("Blog thread view not found"));

        // Map to a response DTO
        return mapToResponseDto(threadView);
    }

    @Override
    public BlogThreadViewResponseDto update(Long id, UpdateBlogThreadViewTitleDto request) {
        // Fetch the existing BlogThreadView
        BlogThreadView threadView = blogThreadViewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog thread view not found"));

        // Update only the title
        threadView.setTitle(request.getTitle()); // Assuming request.getContent() is used for the new title

        // Save the updated BlogThreadView
        BlogThreadView updatedThreadView = blogThreadViewRepository.save(threadView);

        // Return the updated thread view as a response DTO
        return mapToResponseDto(updatedThreadView);
    }

    @Override
    public void delete(Long id) {
        // Fetch the BlogThreadView to ensure it exists
        BlogThreadView threadView = blogThreadViewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog thread view not found"));

        // Deleting the BlogThreadView will also delete the associated BlogPost due to cascade
        blogThreadViewRepository.delete(threadView);
    }
}