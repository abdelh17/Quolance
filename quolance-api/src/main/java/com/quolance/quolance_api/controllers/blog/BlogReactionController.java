package com.quolance.quolance_api.controllers.blog;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.BlogReactionService;
import com.quolance.quolance_api.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class BlogReactionController {

    private final BlogReactionService reactionService;

    @PostMapping("/{entityType}/{entityId}")
    public ResponseEntity<ReactionResponseDto> reactToEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId,
            @RequestBody ReactionRequestDto request
    ) {
        User user = SecurityUtil.getAuthenticatedUser();
        return ResponseEntity.ok(reactionService.reactToEntity(entityId, entityType, user, request));
    }

    @DeleteMapping("/{entityType}/{entityId}")
    public ResponseEntity<String> removeReactionFromEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId
    ) {
        User user = SecurityUtil.getAuthenticatedUser();
        reactionService.removeReactionFromEntity(entityId, entityType, user);
        return ResponseEntity.ok("Reaction removed successfully");
    }
}