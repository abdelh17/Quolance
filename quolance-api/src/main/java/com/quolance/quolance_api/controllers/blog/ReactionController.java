package com.quolance.quolance_api.controllers.blog;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.ReactionService;
import com.quolance.quolance_api.util.SecurityUtil;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping
    public ResponseEntity<ReactionResponseDto> createReaction(
            @RequestBody ReactionRequestDto requestDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        ReactionResponseDto response = reactionService.createReaction(
                requestDto.getBlogPostId(),
                requestDto.getBlogCommentId(),
                user,
                requestDto
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{reactionId}")
    public ResponseEntity<ReactionResponseDto> updateReaction(
            @PathVariable Long reactionId,
            @RequestBody ReactionRequestDto requestDto) {
        ReactionResponseDto response = reactionService.updateReaction(reactionId, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reactionId}")
    public ResponseEntity<String> deleteReaction(@PathVariable Long reactionId) {
        reactionService.deleteReaction(reactionId);
        return ResponseEntity.ok("Reaction deleted successfully");
    }

    @GetMapping("/posts/{blogPostId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactionsByBlogPostId(
            @PathVariable Long blogPostId) {
        List<ReactionResponseDto> reactions = reactionService.getReactionsByBlogPostId(blogPostId);
        return ResponseEntity.ok(reactions);
    }

    @GetMapping("/comments/{blogCommentId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactionsByBlogCommentId(
            @PathVariable Long blogCommentId) {
        List<ReactionResponseDto> reactions = reactionService.getReactionsByBlogCommentId(blogCommentId);
        return ResponseEntity.ok(reactions);
    }

}
