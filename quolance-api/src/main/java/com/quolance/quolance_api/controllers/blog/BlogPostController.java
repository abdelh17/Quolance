package com.quolance.quolance_api.controllers.blog;

import com.quolance.quolance_api.dtos.blog.BlogFilterRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.FileService;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blog-posts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;
    private final FileService fileService;

    @PostMapping
    @Operation(summary = "Create a blog post")
    public ResponseEntity<BlogPostResponseDto> createBlogPost(@Valid @ModelAttribute @RequestBody BlogPostRequestDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        BlogPostResponseDto response = blogPostService.create(request, author);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{postId}")
    @Operation(summary = "Get a blog post by ID")
    public ResponseEntity<BlogPostResponseDto> getBlogPostById(@PathVariable UUID postId) {
        return ResponseEntity.ok(blogPostService.getBlogPost(postId));
    }

    @PutMapping("/update")
    @Operation(summary = "Update a blog post")
    public ResponseEntity<BlogPostResponseDto> updateBlogPost(@RequestBody BlogPostUpdateDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        BlogPostResponseDto response = blogPostService.update(request, author);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get blog posts by user ID",
            description = "Retrieve all blog posts created by a specific user.")
    public ResponseEntity<List<BlogPostResponseDto>> getBlogPostsByUserId(@PathVariable UUID userId) {
        List<BlogPostResponseDto> responses = blogPostService.getBlogPostsByUserId(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping
    @Operation(summary = "Get paginated blog posts")
    public ResponseEntity<Page<BlogPostResponseDto>> getBlogPosts(Pageable pageable) {
        return ResponseEntity.ok(blogPostService.getPaginatedBlogPosts(pageable));
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete a blog post")
    public ResponseEntity<String> deleteBlogPost(@PathVariable UUID postId) {
        User author = SecurityUtil.getAuthenticatedUser();
        blogPostService.deletePost(postId, author);
        return ResponseEntity.ok("The post was successfully deleted");
    }

    @PutMapping("/tags/{postId}")
    public ResponseEntity<String> updateTagsForPost(
            @PathVariable UUID postId,
            @RequestBody List<String> tagNames) {
        blogPostService.updateTagsForPost(postId, tagNames);
        return ResponseEntity.ok("Tags updated successfully");
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter blog posts with pagination")
    public ResponseEntity<Page<BlogPostResponseDto>> filterBlogPosts(@RequestBody BlogFilterRequestDto filterDto, Pageable pageable) {

        Page<BlogPostResponseDto> responses = blogPostService.getFilteredPosts(filterDto, pageable);
        return ResponseEntity.ok(responses);
    }

}