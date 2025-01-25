package com.quolance.quolance_api.dtos.blog;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Reaction;

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
    private String reactionType; 

    private Long blogPostId; 

    private Long blogCommentId; 


    public static Reaction toEntity(ReactionRequestDto reactionRequestDto) {
        return Reaction.builder()
                .reactionType(reactionRequestDto.getReactionType())
                .build();
    }
}