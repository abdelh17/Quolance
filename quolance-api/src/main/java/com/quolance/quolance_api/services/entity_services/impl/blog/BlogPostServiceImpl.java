package com.quolance.quolance_api.services.entity_services.impl.blog;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.BlogTags;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import com.quolance.quolance_api.util.exceptions.InvalidBlogTagException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;

    @Override
    public BlogPostResponseDto create(@Valid BlogPostRequestDto request, User author) {
        BlogPost blogPost = BlogPostRequestDto.toEntity(request);
        blogPost.setUser(author);
        BlogPost savedBlogPost = blogPostRepository.save(blogPost);

        return BlogPostResponseDto.fromEntity(savedBlogPost);
    }

    @Override
    public List<BlogPostResponseDto> getAll() {
        List<BlogPost> blogPosts = blogPostRepository.findAll();
        return blogPosts.stream()
                .map(BlogPostResponseDto::fromEntity)
                .toList();
    }


    @Override
    public List<BlogPostResponseDto> getBlogPostsByUserId(Long userId) {
        List<BlogPost> blogPosts = blogPostRepository.findByUserId(userId);
        return blogPosts.stream()
                .map(BlogPostResponseDto::fromEntity)
                .toList();
    }

    @Override
    public BlogPostResponseDto update(BlogPostUpdateDto request, User author) {
        BlogPost blogPost = getBlogPostEntity(request.getPostId());
        if (!isAuthorOfPost(blogPost, author)) {
            throw new ApiException("You cannot edit a project that does not belong to you.");
        }
        BlogPost updated = updateBlogPost(request, blogPost);
        blogPostRepository.save(updated);
        return BlogPostResponseDto.fromEntity(updated);
    }

    @Override
    public void deletePost(Long id, User author) {
        BlogPost blogPost = getBlogPostEntity(id);

        if (!isAuthorOfPost(blogPost, author)) {
            throw new ApiException("You cannot delete a project that does not belong to you.");
        }
        blogPostRepository.deleteById(id);
    }

    @Override
    public BlogPostResponseDto getBlogPost(Long id) {
        return BlogPostResponseDto.fromEntity(getBlogPostEntity(id));
    }

    private BlogPost updateBlogPost(BlogPostUpdateDto updateRequest, BlogPost blogPost) {
        if (updateRequest.getContent() != null)
            blogPost.setContent(updateRequest.getContent());
        if (updateRequest.getTitle() != null)
            blogPost.setTitle(updateRequest.getTitle());
        return blogPost;
    }

    private boolean isAuthorOfPost(BlogPost blogPost, User author) {
        return blogPost.getUser().getId().equals(author.getId());
    }

    @Override
    public Set<String> updateTagsForPost(Long postId, List<String> tagNames) {
        BlogPost blogPost;
        try {
             blogPost = getBlogPostEntity(postId);
        } catch (ApiException e) {
            throw new ApiException(e.getMessage());
        }

        // Validate and convert the provided tag names into BlogTags enums
        Set<String> invalidTags = new HashSet<>();
        // Convert the provided tag names into BlogTags enums
        Set<BlogTags> newTags = tagNames.stream()
                .map(tagName -> {
                    try {
                        return BlogTags.valueOf(tagName.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        invalidTags .add(tagName); // Collect invalid tags
                        return null;
                    }
                })
                .filter(Objects::nonNull) // Exclude nulls for invalid tags
                .collect(Collectors.toSet());

        // If there are invalid tags, throw a custom exception with their names
        if (!invalidTags.isEmpty()) {
            throw new InvalidBlogTagException("Invalid tags provided: " + String.join(", ", invalidTags));
        }

        // Update the post's tags
        blogPost.setTags(newTags);
        blogPostRepository.save(blogPost);

        // Return the updated tags as strings
        return blogPost.getTags().stream()
                .map(BlogTags::name)
                .collect(Collectors.toSet());
    }

    @Override
    public BlogPost getBlogPostEntity(Long postId) {
        return blogPostRepository.findById(postId).orElseThrow(() ->
                ApiException.builder()
                        .status(HttpServletResponse.SC_NOT_FOUND)
                        .message("No blog post found with ID: " + postId)
                        .build());
    }
}