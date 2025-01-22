package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.blog.ReactionDto;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.ReactionRepository;
import com.quolance.quolance_api.services.ReactionService;
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
        BlogPost blogPost = getBlogPostEntity(blogPostId);

        if (reactionDto.getReactionType() == null || reactionDto.getReactionType().isEmpty()) {
            throw new ApiException("Reaction type cannot be null or empty");
        }

        Reaction reaction = reactionRepository.findByBlogPostIdAndUserId(blogPost.getId(), user.getId())
                .orElse(new Reaction());

        reaction.setBlogPost(blogPost);
        reaction.setUser(user);
        reaction.setType(ReactionDto.toEntity(reactionDto).getType());

        Reaction savedReaction = reactionRepository.save(reaction);
        return ReactionDto.fromEntity(savedReaction);
    }

    @Override
    public void deleteReaction(Long blogPostId, Long userId) {
        Reaction reaction = reactionRepository.findByBlogPostIdAndUserId(blogPostId, userId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Reaction not found for BlogPost ID: " + blogPostId + " and User ID: " + userId));

        reactionRepository.delete(reaction);
    }

    @Override
    public List<ReactionDto> getReactionsByBlogPostId(Long blogPostId) {
        BlogPost blogPost = getBlogPostEntity(blogPostId);

        List<Reaction> reactions = reactionRepository.findByBlogPost(blogPost);

        return reactions.stream()
                .map(ReactionDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ReactionDto updateReaction(Long reactionId, ReactionDto reactionDto) {
        Reaction reaction = getReactionEntity(reactionId);

        if (reactionDto.getReactionType() == null || reactionDto.getReactionType().isEmpty()) {
            throw new ApiException("Reaction type cannot be null or empty");
        }

        reaction.setType(ReactionDto.toEntity(reactionDto).getType());

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