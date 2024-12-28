package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.entity_services.BlogPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final UserRepository userRepository;

    @Override
    public BlogPostResponseDto create(@Valid BlogPostRequestDto request) {
        // Fetch user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create and save the blog post
        BlogPost blogPost = BlogPost.builder()
                .content(request.getContent())
                .user(user)
                .dateCreated(LocalDateTime.now())
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
                .orElseThrow(() -> new RuntimeException("Blog post not found"));

        // Update the blog post fields
        blogPost.setContent(request.getContent());

        // Save the updated blog post
        BlogPost updatedBlogPost = blogPostRepository.save(blogPost);

        // Return response DTO
        return mapToResponseDto(updatedBlogPost);
    }

    @Override
    public void delete(Long id) {
        blogPostRepository.deleteById(id);
    }

    @Override
    public BlogPostResponseDto mapToResponseDto(BlogPost blogPost) {
        return new BlogPostResponseDto(
                blogPost.getId(),
                blogPost.getContent(),
                blogPost.getUser().getFirstName() + " " + blogPost.getUser().getLastName(),
                blogPost.getDateCreated()
//                blogPost.getTags().stream().map(Tag::getName).collect(Collectors.toList()), // Empty if no tags
//                new ArrayList<>(), // Placeholder for reactions
//                new ArrayList<>()  // Placeholder for replies
        );
    }
}