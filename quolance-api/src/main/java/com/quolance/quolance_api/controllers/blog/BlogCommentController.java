package com.quolance.quolance_api.controllers.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blog-comments")
@RequiredArgsConstructor
public class BlogCommentController {

    private final BlogCommentService blogCommentService;

    @PostMapping("/{postId}")
    @Operation(summary = "Create a new blog comment")
    public ResponseEntity<BlogCommentDto> createBlogComment(@PathVariable UUID postId, @Valid @RequestBody BlogCommentDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        BlogCommentDto response = blogCommentService.createBlogComment(postId, author, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/post/{blogPostId}")
    @Operation(summary = "Get all comments for a specific blog post")
    public ResponseEntity<List<BlogCommentDto>> getCommentsByBlogPostId(@PathVariable UUID blogPostId) {
        List<BlogCommentDto> responses = blogCommentService.getCommentsByBlogPostId(blogPostId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a blog comment")
    public ResponseEntity<BlogCommentDto> updateBlogComment(@PathVariable UUID id, @RequestBody BlogCommentDto request) {
        BlogCommentDto response = blogCommentService.updateBlogComment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blog comment")
    public ResponseEntity<String> deleteBlogComment(@PathVariable UUID id) {
        blogCommentService.deleteBlogComment(id);
        return ResponseEntity.ok("The comment was successfully deleted");
    }

}
