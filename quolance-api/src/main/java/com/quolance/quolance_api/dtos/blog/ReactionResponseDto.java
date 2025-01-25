package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.enums.ReactionType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReactionResponseDto {

    private Long id;
    private String userName;
    private ReactionType reactionType;
    private Long blogPostId;
    private Long blogCommentId;

    public static ReactionResponseDto fromEntity(Reaction reaction) {
        return ReactionResponseDto.builder()
                .id(reaction.getId())
                .userName(reaction.getUser().getUsername())
                .reactionType(reaction.getReactionType())
                .blogPostId(reaction.getBlogPost() != null ? reaction.getBlogPost().getId() : null)
                .blogCommentId(reaction.getBlogComment() != null ? reaction.getBlogComment().getId() : null)
                .build();
    }
}