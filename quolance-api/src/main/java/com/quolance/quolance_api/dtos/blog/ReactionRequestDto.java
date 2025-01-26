package com.quolance.quolance_api.dtos.blog;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReactionRequestDto {

    @JsonProperty("reactionType")
    private ReactionType reactionType; 

    @JsonProperty("blogPostId")
    private Long blogPostId; 

    @JsonProperty("blogCommentId")
    private Long blogCommentId; 

   public static Reaction toEntity(ReactionRequestDto reactionRequestDto) {
        return Reaction.builder()
                .reactionType(reactionRequestDto.getReactionType())
                .build();
    }

}