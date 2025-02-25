package com.quolance.quolance_api.services.entity_services.impl.blog;

import com.quolance.quolance_api.dtos.blog.BlogFilterRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogImage;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.BlogTags;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import com.quolance.quolance_api.services.entity_services.FileService;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import com.quolance.quolance_api.util.exceptions.InvalidBlogTagException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final FileService fileService;

    @Override
    public BlogPostResponseDto create(@Valid BlogPostRequestDto request, User author) {
        List<BlogImage> blogImages = new ArrayList<>();

        // Step 1: Upload images and create BlogImage entities
        if (request.getImages() != null) {
            for (MultipartFile image : request.getImages()) {
                System.out.println("Received file: " + image.getOriginalFilename());
                // Upload to Cloudinary or local storage and get the path/URL
                Map<String, Object> uploadResult = fileService.uploadFile(image, author);
                String imagePath = uploadResult.get("secure_url").toString();  // Store the Cloudinary URL

                // Create BlogImage entity and associate it with the post
                BlogImage blogImage = BlogImage.builder()
                        .imagePath(imagePath)
                        .build();
                blogImages.add(blogImage);
            }
        }

        // Step 2: Convert DTO to BlogPost entity
        BlogPost blogPost = BlogPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(author)
                .tags(request.getTags() != null ? Set.copyOf(request.getTags()) : Set.of())
                .images(blogImages)  // Associate the BlogImage entities
                .build();

        // Associate the blog post with each BlogImage
        for (BlogImage blogImage : blogImages) {
            blogImage.setBlogPost(blogPost);
        }

        // Step 3: Save the blog post
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
    public List<BlogPostResponseDto> getBlogPostsByUserId(UUID userId) {
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
    public void deletePost(UUID id, User author) {
        BlogPost blogPost = getBlogPostEntity(id);

        if (!isAuthorOfPost(blogPost, author)) {
            throw new ApiException("You cannot delete a project that does not belong to you.");
        }
        blogPostRepository.deleteById(id);
    }

    @Override
    public BlogPostResponseDto getBlogPost(UUID id) {
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
    public Set<String> updateTagsForPost(UUID postId, List<String> tagNames) {
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
                        invalidTags.add(tagName); // Collect invalid tags
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
    public BlogPost getBlogPostEntity(UUID postId) {
        return blogPostRepository.findById(postId).orElseThrow(() -> ApiException.builder()
                .status(HttpServletResponse.SC_NOT_FOUND)
                .message("No blog post found with ID: " + postId)
                .build());
    }

    @Override
    public Page<BlogPostResponseDto> getPaginatedBlogPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable).map(BlogPostResponseDto::fromEntity);
    }
    @Override
    public Page<BlogPostResponseDto> getFilteredPosts(BlogFilterRequestDto filterDto, Pageable pageable) {
        LocalDateTime startDate = filterDto.getCreationDate();
        if (startDate == null) {
            startDate = LocalDateTime.of(1970, 1, 1, 0, 0);
        }

        List<String> tagStrings = filterDto.getTags() == null || filterDto.getTags().isEmpty()
                ? null
                : filterDto.getTags().stream().map(Enum::name).toList();
        int tagCount = (tagStrings == null) ? 0 : tagStrings.size();

        return blogPostRepository.findFilteredPosts(
                filterDto.getTitle(),
                filterDto.getContent(),
                startDate,
                tagStrings,
                tagCount,
                pageable
        ).map(BlogPostResponseDto::fromEntity);
    }

}