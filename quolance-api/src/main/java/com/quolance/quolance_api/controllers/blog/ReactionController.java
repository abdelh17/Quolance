package com.quolance.quolance_api.controllers.blog;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quolance.quolance_api.dtos.blog.ReactionDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ReactionService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping("/{blogPostId}")
    public ResponseEntity<ReactionDto> addReaction(
            @PathVariable Long blogPostId,
            @Valid @RequestBody ReactionDto reactionDto,
            @AuthenticationPrincipal User user) {
        System.out.println("ReactionDto received: " + reactionDto);
        System.out.println("BlogPostId: " + reactionDto.getBlogPostId());
        System.out.println("UserId: " + reactionDto.getUserId());
        System.out.println("Reaction Type: " + reactionDto.getReactionType());

        ReactionDto savedReaction = reactionService.addReaction(blogPostId, user, reactionDto);
        return ResponseEntity.ok(savedReaction);
    }

    @PutMapping("/{reactionId}")
    public ResponseEntity<ReactionDto> updateReaction(
            @PathVariable Long reactionId,
            @Valid @RequestBody ReactionDto reactionDto) {
        ReactionDto updatedReaction = reactionService.updateReaction(reactionId, reactionDto);
        return ResponseEntity.ok(updatedReaction);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteReaction(
            @RequestParam Long blogPostId,
            @RequestParam Long userId) {
        reactionService.deleteReaction(blogPostId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{blogPostId}")
    public ResponseEntity<List<ReactionDto>> getReactionsByBlogPostId(@PathVariable Long blogPostId) {
        List<ReactionDto> reactions = reactionService.getReactionsByBlogPostId(blogPostId);
        return ResponseEntity.ok(reactions);
    }
}
