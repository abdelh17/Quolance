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

import java.util.List;

@RestController
@RequestMapping("/api/blog-posts/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping("/post")
    public ResponseEntity<ReactionResponseDto> reactToPost(
            @Valid @RequestBody ReactionRequestDto requestDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        ReactionResponseDto response = reactionService.reactToPost(requestDto, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/comment")
    public ResponseEntity<ReactionResponseDto> reactToComment(
            @Valid @RequestBody ReactionRequestDto requestDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        ReactionResponseDto response = reactionService.reactToComment(requestDto, user);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactionsByPost(@PathVariable Long postId) {
        List<ReactionResponseDto> reactions = reactionService.getReactionsByBlogPostId(postId);
        return ResponseEntity.ok(reactions);
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactionsByComment(@PathVariable Long commentId) {
        List<ReactionResponseDto> reactions = reactionService.getReactionsByBlogCommentId(commentId);
        return ResponseEntity.ok(reactions);
    }

    @DeleteMapping("/{reactionId}")
    public ResponseEntity<String> deleteReaction(@PathVariable Long reactionId) {
        User user = SecurityUtil.getAuthenticatedUser();
        reactionService.deleteReaction(reactionId, user);
        return ResponseEntity.ok("Reaction deleted successfully.");
    }

}
