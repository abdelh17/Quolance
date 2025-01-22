package com.quolance.quolance_api.services;

import java.util.List;

import com.quolance.quolance_api.dtos.blog.ReactionDto;
import com.quolance.quolance_api.entities.User;

public interface  ReactionService {
    
    ReactionDto addReaction(Long blogPostId, User user, ReactionDto reactionDto);
    void deleteReaction(Long blogPostId, Long userId);
    List<ReactionDto> getReactionsByBlogPostId(Long blogPostId);
    ReactionDto updateReaction(Long reactionId, ReactionDto reactionDto); 
}