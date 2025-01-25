package com.quolance.quolance_api.services.entity_services.impl;

// import com.quolance.quolance_api.dtos.blog.ReactionDto;
import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.ReactionRepository;
import com.quolance.quolance_api.services.entity_services.BlogCommentService;
import com.quolance.quolance_api.services.entity_services.BlogPostService;
import com.quolance.quolance_api.services.entity_services.ReactionService;
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
    private final BlogPostService blogPostService;
    private final BlogCommentService blogCommentService;

    @Override
    public ReactionResponseDto createReaction(Long blogPostId, Long blogCommentId, User user, ReactionRequestDto request) {
        validateReactionType(request.getReactionType());

        Reaction reaction = new Reaction();
        if (blogPostId != null) {
            BlogPost blogPost = blogPostService.getBlogPostEntity(blogPostId);
            reaction.setBlogPost(blogPost);
        }

        if (blogCommentId != null) {
            BlogComment blogComment = blogCommentService.getBlogCommentEntity(blogCommentId);
            reaction.setBlogComment(blogComment);
        }

        reaction.setUser(user);
        reaction.setReactionType(request.getReactionType());

        Reaction savedReaction = reactionRepository.save(reaction);
        return ReactionResponseDto.fromEntity(savedReaction);
    }

    @Override
    public ReactionResponseDto updateReaction(Long reactionId, ReactionRequestDto request) {
        validateReactionType(request.getReactionType());

        Reaction reaction = getReactionEntity(reactionId);
        reaction.setReactionType(request.getReactionType());

        Reaction updatedReaction = reactionRepository.save(reaction);
        return ReactionResponseDto.fromEntity(updatedReaction);
    }

    @Override
    public void deleteReaction(Long reactionId) {
        Reaction reaction = getReactionEntity(reactionId);
        reactionRepository.delete(reaction);
    }

    @Override
    public List<ReactionResponseDto> getReactionsByBlogPostId(Long blogPostId) {
        BlogPost blogPost = blogPostService.getBlogPostEntity(blogPostId);

        return reactionRepository.findByBlogPost(blogPost).stream()
                .map(ReactionResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReactionResponseDto> getReactionsByBlogCommentId(Long blogCommentId) {
        BlogComment blogComment = blogCommentService.getBlogCommentEntity(blogCommentId);

        return reactionRepository.findByBlogPost(blogComment).stream()
                .map(ReactionResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Reaction getReactionEntity(Long reactionId) {
        return reactionRepository.findById(reactionId)
                .orElseThrow(() -> new EntityNotFoundException("Reaction not found with ID: " + reactionId));
    }

    private void validateReactionType(String reactionType) {
        List<String> validReactions = List.of("LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY");

        if (reactionType == null || reactionType.isEmpty()) {
            throw new ApiException("Reaction type cannot be null or empty");
        }

        if (!validReactions.contains(reactionType.toUpperCase())) {
            throw new ApiException("Invalid reaction type: " + reactionType);
        }
    }
}
