package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.Reactions;
import com.quolance.quolance_api.entities.Reply;
import com.quolance.quolance_api.entities.User;
import lombok.*;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReplyDto {

    private long id;
    private String content;
    private long reactionId;
    private long userId;
    private Set<Long> relatedReplyIds;

    // Convert ReplyDto to Reply entity
    public Reply toEntity(Reactions reaction, User user, Set<Reply> relatedReplies) {
        return Reply.builder()
                .id(this.id)
                .content(this.content)
                .reaction(reaction)
                .user(user)
                .relatedReplies(relatedReplies)
                .build();
    }

    // Convert Reply entity to ReplyDto
    public static ReplyDto fromEntity(Reply reply) {
        return ReplyDto.builder()
                .id(reply.getId())
                .content(reply.getContent())
                .reactionId(reply.getReaction().getId())
                .userId(reply.getUser().getId())
                .relatedReplyIds(reply.getRelatedReplies().stream().map(Reply::getId).collect(Collectors.toSet()))
                .build();
    }
}