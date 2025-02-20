package com.quolance.quolance_api.services.entity_services.impl.blog;

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
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final FileService fileService;

    @Override
    public BlogPostResponseDto create(@Valid BlogPostRequestDto request, User author) {
        log.info("Creating a new blog post for user: {}", author.getId());
        List<BlogImage> blogImages = new ArrayList<>();

        // Step 1: Upload images and create BlogImage entities
        if (request.getImages() != null) {
            for (MultipartFile image : request.getImages()) {
                log.debug("Processing image: {}", image.getOriginalFilename());
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
        log.info("Blog post created successfully with ID: {}", savedBlogPost.getId());
        return BlogPostResponseDto.fromEntity(savedBlogPost);
    }
    @Override
    public List<BlogPostResponseDto> getAll() {
        log.info("Fetching all blog posts");
        List<BlogPost> blogPosts = blogPostRepository.findAll();
        return blogPosts.stream()
                .map(BlogPostResponseDto::fromEntity)
                .toList();
    }

    @Override
    public List<BlogPostResponseDto> getBlogPostsByUserId(UUID userId) {
        log.info("Fetching blog posts for user ID: {}", userId);
        List<BlogPost> blogPosts = blogPostRepository.findByUserId(userId);
        return blogPosts.stream()
                .map(BlogPostResponseDto::fromEntity)
                .toList();
    }

    @Override
    public BlogPostResponseDto update(BlogPostUpdateDto request, User author) {
        log.info("Updating blog post with ID: {}", request.getPostId());
        BlogPost blogPost = getBlogPostEntity(request.getPostId());
        if (!isAuthorOfPost(blogPost, author)) {
            log.warn("User {} attempted to edit a blog post they do not own", author.getId());
            throw new ApiException("You cannot edit a project that does not belong to you.");
        }
        BlogPost updated = updateBlogPost(request, blogPost);
        blogPostRepository.save(updated);
        log.info("Blog post updated successfully");
        return BlogPostResponseDto.fromEntity(updated);
    }

    @Override
    public void deletePost(UUID id, User author) {
        log.info("Deleting blog post with ID: {}", id);
        BlogPost blogPost = getBlogPostEntity(id);

        if (!isAuthorOfPost(blogPost, author)) {
            log.warn("User {} attempted to delete a blog post they do not own", author.getId());
            throw new ApiException("You cannot delete a project that does not belong to you.");
        }
        blogPostRepository.deleteById(id);
        log.info("Blog post deleted successfully");
    }

    @Override
    public BlogPostResponseDto getBlogPost(UUID id) {
        log.info("Fetching blog post with ID: {}", id);
        return BlogPostResponseDto.fromEntity(getBlogPostEntity(id));
    }

    private BlogPost updateBlogPost(BlogPostUpdateDto updateRequest, BlogPost blogPost) {
        log.debug("Updating blog post content and title");
        if (updateRequest.getContent() != null)
            blogPost.setContent(updateRequest.getContent());
        if (updateRequest.getTitle() != null)
            blogPost.setTitle(updateRequest.getTitle());
        return blogPost;
    }

    private boolean isAuthorOfPost(BlogPost blogPost, User author) {
        boolean isAuthor = blogPost.getUser().getId().equals(author.getId());
        if (!isAuthor) {
            log.warn("User {} attempted to modify a blog post they do not own", author.getId());
        }
        return isAuthor;
    }

    @Override
    public Set<String> updateTagsForPost(UUID postId, List<String> tagNames) {
        log.info("Updating tags for blog post ID: {}", postId);
        BlogPost blogPost;
        try {
            log.debug("Fetching blog post with ID: {}", postId);
            blogPost = getBlogPostEntity(postId);
        } catch (ApiException e) {
            log.warn("Failed to retrieve blog post with ID: {}. Error: {}", postId, e.getMessage());
            throw new ApiException(e.getMessage());
        }

        // Validate and convert the provided tag names into BlogTags enums
        Set<String> invalidTags = new HashSet<>();
        log.debug("Converting provided tag names to BlogTags enums...");
        // Convert the provided tag names into BlogTags enums
        Set<BlogTags> newTags = tagNames.stream()
                .map(tagName -> {
                    try {
                        log.debug("Processing tag: {}", tagName);
                        return BlogTags.valueOf(tagName.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        invalidTags.add(tagName); // Collect invalid tags
                        log.warn("Invalid tag encountered: {}", tagName);
                        return null;
                    }
                })
                .filter(Objects::nonNull) // Exclude nulls for invalid tags
                .collect(Collectors.toSet());

        // If there are invalid tags, throw a custom exception with their names
        if (!invalidTags.isEmpty()) {
            log.warn("Invalid tags encountered: {}", String.join(", ", invalidTags));
            throw new InvalidBlogTagException("Invalid tags provided: " + String.join(", ", invalidTags));
        }

        // Update the post's tags
        blogPost.setTags(newTags);

        blogPostRepository.save(blogPost);
        log.info("Tags updated successfully for blog post ID: {}", postId);
        // Return the updated tags as strings
        return blogPost.getTags().stream()
                .map(BlogTags::name)
                .collect(Collectors.toSet());
    }

    @Override
    public BlogPost getBlogPostEntity(UUID postId) {
        log.debug("Fetching blog post entity with ID: {}", postId);
               return blogPostRepository.findById(postId).orElseThrow(() -> {
            log.warn("No blog post found with ID: {}", postId);
            return ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("No blog post found with ID: " + postId)
                    .build();
        });
    }

    @Override
    public Page<BlogPostResponseDto> getPaginatedBlogPosts(Pageable pageable) {
        return blogPostRepository.findAll(pageable).map(BlogPostResponseDto::fromEntity);
    }
}