package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;

import java.util.List;

public interface  ReactionService {
    
    ReactionResponseDto reactToPost(ReactionRequestDto requestDto, User user);

    ReactionResponseDto reactToComment(ReactionRequestDto requestDto, User user);
    
    List<ReactionResponseDto> getReactionsByBlogPostId(Long blogPostId);
    
    List<ReactionResponseDto> getReactionsByBlogCommentId(Long blogCommentId);
    
    void deleteReaction(Long reactionId, User user);
}