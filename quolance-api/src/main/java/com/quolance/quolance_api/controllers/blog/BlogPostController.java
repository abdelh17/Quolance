package com.quolance.quolance_api.controllers.blog;

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
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blog-posts")
@RequiredArgsConstructor
@Slf4j
public class BlogPostController {

    private final BlogPostService blogPostService;
    private final FileService fileService;

    @PostMapping
    @Operation(summary = "Create a blog post")
    public ResponseEntity<BlogPostResponseDto> createBlogPost(
            @Valid @ModelAttribute @RequestBody BlogPostRequestDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is creating a blog post", author.getId());
        BlogPostResponseDto response = blogPostService.create(request, author);
        log.info("User {} created successfully BlogPost with ID {}",  author.getId(), response.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Get a blog post by ID")
    public ResponseEntity<BlogPostResponseDto> getBlogPostById(@PathVariable UUID postId) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} fetching blog post with ID {}", author.getId(), postId);
        return ResponseEntity.ok(blogPostService.getBlogPost(postId));
    }

    @PutMapping("/update")
    @Operation(summary = "Update a blog post")
    public ResponseEntity<BlogPostResponseDto> updateBlogPost(@RequestBody BlogPostUpdateDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is attempting to update blog post {}", author.getId(), request.getPostId());
        BlogPostResponseDto response = blogPostService.update(request, author);
        log.info("User {} updated successfully Blog post {}", author.getId(), request.getPostId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get blog posts by user ID", description = "Retrieve all blog posts created by a specific user.")
    public ResponseEntity<List<BlogPostResponseDto>> getBlogPostsByUserId(@PathVariable UUID userId) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is fetching blog posts for user {}", author.getId(), userId);
        List<BlogPostResponseDto> responses = blogPostService.getBlogPostsByUserId(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping
    @Operation(summary = "Get paginated blog posts")
    public ResponseEntity<Page<BlogPostResponseDto>> getBlogPosts(Pageable pageable) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is fetching paginated blog posts", author.getId());                                 
        return ResponseEntity.ok(blogPostService.getPaginatedBlogPosts(pageable));
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete a blog post")
    public ResponseEntity<String> deleteBlogPost(@PathVariable UUID postId) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is attempting to delete blog post {}", author.getId(), postId);
        blogPostService.deletePost(postId, author);
        log.info("User {} deleted successfully Blog post {}",author.getId(), postId);
        return ResponseEntity.ok("The post was successfully deleted");
    }

    @PutMapping("/tags/{postId}")
    public ResponseEntity<String> updateTagsForPost(
            @PathVariable UUID postId,
            @RequestBody List<String> tagNames) {
                User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is attempting to update tags for blog post {} with tags {}", author.getId(), postId, tagNames);
        blogPostService.updateTagsForPost(postId, tagNames);
        log.info("User {} has successfully updated tags for blog post {}", author.getId(), postId);
        return ResponseEntity.ok("Tags updated successfully");
    }
}