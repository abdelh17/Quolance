package com.quolance.quolance_api.services.entity_services;

import java.util.List;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;

public interface  ReactionService {
    
    ReactionResponseDto createReaction(Long blogPostId, Long blogCommentId, User user, ReactionRequestDto request);

    ReactionResponseDto updateReaction(Long reactionId, ReactionRequestDto request);

    void deleteReaction(Long reactionId);

    List<ReactionResponseDto> getReactionsByBlogPostId(Long blogPostId);

    List<ReactionResponseDto> getReactionsByBlogCommentId(Long blogCommentId);

    Reaction getReactionEntity(Long reactionId);
}