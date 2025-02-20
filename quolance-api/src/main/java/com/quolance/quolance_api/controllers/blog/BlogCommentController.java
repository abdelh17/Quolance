package com.quolance.quolance_api.controllers.blog;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/blog-comments")
@RequiredArgsConstructor
@Slf4j
public class BlogCommentController {

    private final BlogCommentService blogCommentService;

    @PostMapping("/{postId}")
    @Operation(summary = "Create a new blog comment")
    public ResponseEntity<BlogCommentDto> createBlogComment(@PathVariable UUID postId, @Valid @RequestBody BlogCommentDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is creating a comment on post {}", author.getId(), postId);
        BlogCommentDto response = blogCommentService.createBlogComment(postId, author, request);
        log.info("User {} successfully created a comment on post {}", author.getId(), postId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{blogPostId}")
    @Operation(summary = "Get paginated comments for a specific blog post")
    public ResponseEntity<Page<BlogCommentDto>> getCommentsByBlogPostId(
            @PathVariable UUID blogPostId, Pageable pageable) {
                User currentUser =  SecurityUtil.getAuthenticatedUser();
                log.info("User {} is Fetching comments for blog post {}", currentUser.getId(), blogPostId);
        return ResponseEntity.ok(blogCommentService.getPaginatedComments(blogPostId, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a blog comment")
    public ResponseEntity<BlogCommentDto> updateBlogComment(@PathVariable UUID id, @RequestBody BlogCommentDto request) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is updating comment {}", author.getId(), id);
        BlogCommentDto response = blogCommentService.updateBlogComment(id, request, author);
        log.info("Comment {} updated successfully", id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blog comment")
    public ResponseEntity<String> deleteBlogComment(@PathVariable UUID id) {
        User author = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is deleting comment {}", author.getId(), id);
        blogCommentService.deleteBlogComment(id, author);
        log.info("User {} successfully deleted Comment {}", author.getId(), id);
        return ResponseEntity.ok("The comment was successfully deleted");
    }

}
