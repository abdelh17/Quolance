package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.ReactionType;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ReactionResponseDto {

    private UUID id;
    private String userName;
    private ReactionType reactionType;
    private UUID blogPostId;
    private UUID blogCommentId;

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