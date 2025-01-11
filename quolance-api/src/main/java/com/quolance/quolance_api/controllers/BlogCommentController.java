package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.BlogCommentDto;
import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.repositories.BlogCommentRepository;
import com.quolance.quolance_api.services.entity_services.BlogCommentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/blog-comments")
@RequiredArgsConstructor
public class BlogCommentController  {

    private final BlogCommentService blogCommentService;

    // Create a new blog comment
    @PostMapping
    @Operation(summary = "Create a new blog comment")
    public ResponseEntity<?> createBlogComment(
        @Valid @RequestBody BlogCommentDto request) {

    // Extract blogPostId and userId from the request body
    Long blogPostId = request.getBlogPostId();
    Long userId = request.getUserId();

    // Check if comment content is empty
    if (request.getContent().isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body("Comment content cannot be empty");
    }

    // Create the comment
    BlogCommentDto response = blogCommentService.createBlogComment(blogPostId, userId, request);
    return ResponseEntity.ok(response);
}
    // public ResponseEntity<BlogCommentDto> createBlogComment(
        
    //         @Valid @RequestBody BlogCommentDto request) {
                

    //     // Extract blogPostId and userId from the request body
    //     Long blogPostId = request.getBlogPostId();
    //     Long userId = request.getUserId();

    //     // Create the comment
    //     BlogCommentDto response = blogCommentService.createBlogComment(blogPostId, userId, request);
    //     return ResponseEntity.ok(response);
    // }

    // Get all comments for a specific blog post
    @GetMapping("/post/{blogPostId}")
    @Operation(summary = "Get all comments for a specific blog post")
    public ResponseEntity<List<BlogCommentDto>> getCommentsByBlogPostId(@PathVariable Long blogPostId) {
        List<BlogCommentDto> responses = blogCommentService.getCommentsByBlogPostId(blogPostId);
        return ResponseEntity.ok(responses);
    }

    // Get a specific blog comment by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get a blog comment by ID")
    public ResponseEntity<BlogCommentDto> getBlogCommentById(@PathVariable Long id) {
        BlogCommentDto response = blogCommentService.getBlogCommentById(id);
        return ResponseEntity.ok(response);
    }

    // Update an existing blog comment
    @PutMapping("/{id}")
    @Operation(summary = "Update a blog comment")
    public ResponseEntity<BlogCommentDto> updateBlogComment(@PathVariable Long id, @RequestBody BlogCommentDto request) {
        BlogCommentDto response = blogCommentService.updateBlogComment(id, request);
        return ResponseEntity.ok(response);
    }

    // Delete a blog comment by ID
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blog comment")
    public ResponseEntity<String> deleteBlogComment(@PathVariable Long id) {
        blogCommentService.deleteBlogComment(id);
        return ResponseEntity.ok("The comment was successfully deleted");
    }

    // // Get paginated list of comments for a blog post
    // @GetMapping("/post/{blogPostId}/paginated")
    // @Operation(summary = "Get paginated comments for a specific blog post")
    // public ResponseEntity<Page<BlogCommentDto>> getPaginatedCommentsByBlogPostId(
    //         @PathVariable Long blogPostId,
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "10") int size) {

    //     Pageable pageable = PageRequest.of(page, size);
    //     Page<BlogCommentDto> response = blogCommentService.getPaginatedCommentsByBlogPostId(blogPostId, pageable);
    //     return ResponseEntity.ok(response);
    // }
}
