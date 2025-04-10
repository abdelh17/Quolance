package com.quolance.quolance_api.dtos.blog;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.ReactionType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReactionRequestDto {

    @JsonProperty("reactionType")
    @NotNull(message = "Reaction type is required")
    private ReactionType reactionType; 

    @JsonProperty("blogPostId")
    private UUID blogPostId;

    @JsonProperty("blogCommentId")
    private UUID blogCommentId;

   public static Reaction toEntity(ReactionRequestDto reactionRequestDto) {
        return Reaction.builder()
                .reactionType(reactionRequestDto.getReactionType())
                .build();
    }

}