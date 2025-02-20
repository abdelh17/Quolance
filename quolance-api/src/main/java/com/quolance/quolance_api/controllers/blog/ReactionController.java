package com.quolance.quolance_api.controllers.blog;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.ReactionService;
import com.quolance.quolance_api.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blog-posts/reactions")
@RequiredArgsConstructor
@Slf4j
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping("/post")
    public ResponseEntity<ReactionResponseDto> reactToPost(
            @Valid @RequestBody ReactionRequestDto requestDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is attempting to react to post with request: {}", user.getId(), requestDto);
        ReactionResponseDto response = reactionService.reactToPost(requestDto, user);
        log.info("User {} has succesfully reacted to post with request: {}", user.getId(), requestDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/comment")
    public ResponseEntity<ReactionResponseDto> reactToComment(
            @Valid @RequestBody ReactionRequestDto requestDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is attempting to react to comment with request: {}", user.getId(), requestDto);
        ReactionResponseDto response = reactionService.reactToComment(requestDto, user);
        log.info("User {} successfully reacted to comment with request: {}", user.getId(), requestDto);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactionsByPost(@PathVariable UUID postId) {
        User user = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is attempting to Fetch reactions for post with ID: {}",user.getId(), postId);
        List<ReactionResponseDto> reactions = reactionService.getReactionsByBlogPostId(postId);
        log.info("User {} successfully fetched reactions for post with ID: {}",user.getId(), postId);
        return ResponseEntity.ok(reactions);
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactionsByComment(@PathVariable UUID commentId) {
        User user = SecurityUtil.getAuthenticatedUser();
        log.info("User {} is attempting to Fetch reactions for comment with ID: {}",user.getId(), commentId);
        List<ReactionResponseDto> reactions = reactionService.getReactionsByBlogCommentId(commentId);
        log.info("User {} successfully fetched reactions for comment with ID: {}",user.getId(), commentId);
        return ResponseEntity.ok(reactions);
    }

    @DeleteMapping("/{reactionId}")
    public ResponseEntity<String> deleteReaction(@PathVariable UUID reactionId) {
        User user = SecurityUtil.getAuthenticatedUser();
        log.info("User {} deleting reaction with ID: {}", user.getId(), reactionId);
        reactionService.deleteReaction(reactionId, user);
        log.info("User {} successfully deleted reaction with ID: {}", user.getId(), reactionId);
        return ResponseEntity.ok("Reaction deleted successfully.");
    }

}
