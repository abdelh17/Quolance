package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.Reactions;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.Vote;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class voteDto {

    private long id;
    private boolean upvote;
    private long reactionId;
    private long userId;

    // Convert VoteDto to Vote entity
    public Vote toEntity(Reactions reaction, User user) {
        return Vote.builder()
                .id(this.id)
                .upvote(this.upvote)
                .reaction(reaction)
                .user(user)
                .build();
    }

    // Convert Vote entity to VoteDto
    public static voteDto fromEntity(Vote vote) {
        return voteDto.builder()
                .id(vote.getId())
                .upvote(vote.isUpvote())
                .reactionId(vote.getReaction().getId())
                .userId(vote.getUser().getId())
                .build();
    }
}