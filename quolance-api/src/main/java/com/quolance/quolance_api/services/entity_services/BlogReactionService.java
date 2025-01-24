package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;

import com.quolance.quolance_api.entities.User;

public interface BlogReactionService {
    ReactionResponseDto reactToEntity(Long id, String EntityType, User user, ReactionRequestDto request);
    void removeReactionFromEntity(Long id, String EntityType, User user);
}
