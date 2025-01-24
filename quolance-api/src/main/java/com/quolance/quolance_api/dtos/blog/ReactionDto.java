package com.quolance.quolance_api.dtos.blog;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.util.enums.ReactionType;
import com.quolance.quolance_api.util.enums.ReactionTypeDeserializer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReactionDto {
    private Long id;
    private Long blogPostId;
    private Long userId;

    @JsonDeserialize(using = ReactionTypeDeserializer.class)
    @NotNull(message = "Reaction type cannot be null or empty")
    private ReactionType reactionType;

    public static ReactionDto fromEntity(Reaction reaction) {
        ReactionDto dto = new ReactionDto();
        dto.setId(reaction.getId());
        dto.setBlogPostId(reaction.getBlogPost().getId());
        dto.setUserId(reaction.getUser().getId());
        dto.setReactionType(reaction.getType());
        return dto;
    }

    public static Reaction toEntity(ReactionDto reactionDto) {
        Reaction reaction = new Reaction();
        reaction.setType(reactionDto.getReactionType());
        return reaction;
    }

    @Override
    public String toString() {
        return "ReactionDto{" +
                "id=" + id +
                ", blogPostId=" + blogPostId +
                ", userId=" + userId +
                ", reactionType=" + reactionType +
                '}';
    }
}
