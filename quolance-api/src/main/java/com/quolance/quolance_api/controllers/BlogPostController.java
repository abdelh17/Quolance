package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.services.entity_services.BlogPostService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;



@RestController
@RequestMapping("/api/blog-posts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    @PostMapping
    @Operation(summary = "Create a blog post")
    public ResponseEntity<BlogPostResponseDto> createBlogPost(@Valid @RequestBody BlogPostRequestDto request) {
        BlogPostResponseDto response = blogPostService.create(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all blog posts")
    public ResponseEntity<List<BlogPostResponseDto>> getAllBlogPosts() {
        List<BlogPostResponseDto> responses = blogPostService.getAll();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a blog post by Blog ID")
    public ResponseEntity<BlogPostResponseDto> getBlogPostById(@PathVariable Long id) {
        return blogPostService.findById(id)
                .map(blogPost -> ResponseEntity.ok(blogPostService.mapToResponseDto(blogPost)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a blog post")
    public ResponseEntity<BlogPostResponseDto> updateBlogPost(@PathVariable Long id, @Valid @RequestBody BlogPostRequestDto request) {
        BlogPostResponseDto response = blogPostService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get blog posts by user ID", description = "Retrieve all blog posts created by a specific user.")
    public ResponseEntity<List<BlogPostResponseDto>> getBlogPostsByUserId(@PathVariable Long userId) {
        List<BlogPostResponseDto> responses = blogPostService.getBlogPostsByUserId(userId);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blog post")
    public ResponseEntity<Void> deleteBlogPost(@PathVariable Long id) {
        blogPostService.delete(id);
        return ResponseEntity.noContent().build();
    }
}