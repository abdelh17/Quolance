package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.blog.ReactionDto;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.ReactionRepository;
import com.quolance.quolance_api.services.ReactionService;
import com.quolance.quolance_api.util.enums.ReactionType;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReactionServiceImpl implements ReactionService {

    private final ReactionRepository reactionRepository;
    private final BlogPostRepository blogPostRepository;

    @Override
    public ReactionDto addReaction(Long blogPostId, User user, ReactionDto reactionDto) {
        // Validate the ReactionType in DTO
        if (reactionDto.getReactionType() == null) {
            throw new ApiException("Reaction type cannot be null");
        }

        BlogPost blogPost = getBlogPostEntity(blogPostId);

        // Check if the user has already reacted to this blog post
        Reaction reaction = reactionRepository.findByBlogPostIdAndUserId(blogPost.getId(), user.getId())
                .orElse(new Reaction());

        // Update reaction details
        reaction.setBlogPost(blogPost);
        reaction.setUser(user);
        reaction.setType(reactionDto.getReactionType());

        // Save reaction
        Reaction savedReaction = reactionRepository.save(reaction);
        return ReactionDto.fromEntity(savedReaction);
    }

    @Override
    public void deleteReaction(Long blogPostId, Long userId) {
        // Find the reaction by BlogPost ID and User ID
        Reaction reaction = reactionRepository.findByBlogPostIdAndUserId(blogPostId, userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Reaction not found for BlogPost ID: " + blogPostId + " and User ID: " + userId));

        // Delete the reaction
        reactionRepository.delete(reaction);
    }

    @Override
    public List<ReactionDto> getReactionsByBlogPostId(Long blogPostId) {
        BlogPost blogPost = getBlogPostEntity(blogPostId);

        // Fetch all reactions for the blog post
        List<Reaction> reactions = reactionRepository.findByBlogPost(blogPost);

        // Map to DTOs
        return reactions.stream()
                .map(ReactionDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ReactionDto updateReaction(Long reactionId, ReactionDto reactionDto) {
        // Validate the ReactionType in DTO
        if (reactionDto.getReactionType() == null) {
            throw new ApiException("Reaction type cannot be null");
        }

        Reaction reaction = getReactionEntity(reactionId);

        // Update reaction type
        reaction.setType(reactionDto.getReactionType());

        // Save updated reaction
        Reaction updatedReaction = reactionRepository.save(reaction);
        return ReactionDto.fromEntity(updatedReaction);
    }

    private BlogPost getBlogPostEntity(Long blogPostId) {
        return blogPostRepository.findById(blogPostId)
                .orElseThrow(() -> new EntityNotFoundException("BlogPost not found with ID: " + blogPostId));
    }

    private Reaction getReactionEntity(Long reactionId) {
        return reactionRepository.findById(reactionId)
                .orElseThrow(() -> new EntityNotFoundException("Reaction not found with ID: " + reactionId));
    }
}
