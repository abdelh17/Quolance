package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.BlogReactionType;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactionResponseDto {
    private Long reactionId;
    private Long postId;       // Optional: Null if the reaction is for a reply
    private Long commentId;      // Optional: Null if the reaction is for a post
    private String username;   // The user who reacted
    private BlogReactionType reactionType;

    // Static factory method to map a Reaction entity to a DTO
    public static ReactionResponseDto fromEntity(Reaction reaction) {
        return ReactionResponseDto.builder()
                .reactionId(reaction.getId())
                .postId(reaction.getPost() != null ? reaction.getPost().getId() : null)
                .commentId(reaction.getComment() != null ? reaction.getComment().getId() : null)
                .username(reaction.getUser().getUsername())
                .reactionType(reaction.getReactionType())
                .build();
    }
}
