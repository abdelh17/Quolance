package com.quolance.quolance_api.controllers.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blog-comments")
@RequiredArgsConstructor
public class BlogCommentController {

    private final BlogCommentService blogCommentService;

    @PostMapping("/{postId}")
    @Operation(summary = "Create a new blog comment")
    public ResponseEntity<BlogCommentDto> createBlogComment(@PathVariable Long postId,
            @Valid @RequestBody BlogCommentDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        BlogCommentDto response = blogCommentService.createBlogComment(postId, author, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{blogPostId}")
    @Operation(summary = "Get paginated comments for a specific blog post")
    public ResponseEntity<Page<BlogCommentDto>> getCommentsByBlogPostId(
            @PathVariable Long blogPostId, Pageable pageable) {
        return ResponseEntity.ok(blogCommentService.getPaginatedComments(blogPostId, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a blog comment")
    public ResponseEntity<BlogCommentDto> updateBlogComment(@PathVariable Long id, @RequestBody BlogCommentDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        BlogCommentDto response = blogCommentService.updateBlogComment(id, request, author);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blog comment")
    public ResponseEntity<String> deleteBlogComment(@PathVariable Long id) {
        User author = SecurityUtil.getAuthenticatedUser();
        blogCommentService.deleteBlogComment(id, author);
        return ResponseEntity.ok("The comment was successfully deleted");
    }

}
