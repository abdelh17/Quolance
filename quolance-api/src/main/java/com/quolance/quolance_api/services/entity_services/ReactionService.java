package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;

import java.util.List;
import java.util.UUID;

public interface  ReactionService {
    
    ReactionResponseDto reactToPost(ReactionRequestDto requestDto, User user);

    ReactionResponseDto reactToComment(ReactionRequestDto requestDto, User user);

    List<ReactionResponseDto> getReactionsByBlogPostId(UUID blogPostId);

    List<ReactionResponseDto> getReactionsByBlogCommentId(UUID blogCommentId);

    void deleteReaction(UUID reactionId, User user);
}