package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.util.enums.ReactionType;

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
    private String reactionType;

    public static ReactionDto fromEntity(Reaction reaction) {
        ReactionDto dto = new ReactionDto();
        dto.setId(reaction.getId());
        dto.setBlogPostId(reaction.getBlogPost().getId());
        dto.setUserId(reaction.getUser().getId());
        dto.setReactionType(reaction.getType().toString());
        return dto;
    }
    
    public static Reaction toEntity(ReactionDto reactionDto) {
        Reaction reaction = new Reaction();
        reaction.setType(ReactionType.valueOf(reactionDto.getReactionType().toUpperCase()));
        return reaction;
    }
}
