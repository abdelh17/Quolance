package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ReactionType;
import com.quolance.quolance_api.repositories.ReactionRepository;
import com.quolance.quolance_api.services.entity_services.BlogCommentService;
import com.quolance.quolance_api.services.entity_services.BlogPostService;
import com.quolance.quolance_api.services.entity_services.ReactionService;
import com.quolance.quolance_api.util.exceptions.ApiException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
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
    public ReactionResponseDto reactToPost(ReactionRequestDto requestDto, User user) {
        if (requestDto.getBlogPostId() == null) {
            throw new ApiException("BlogPostId must be provided for reacting to a post.");
        }

        validateReactionType(requestDto.getReactionType());

        BlogPost blogPost = blogPostService.getBlogPostEntity(requestDto.getBlogPostId());

        Reaction existingReaction = reactionRepository.findByUserAndBlogPost(user, blogPost)
                .orElse(null);

        if (existingReaction != null) {
            existingReaction.setReactionType(requestDto.getReactionType());
            Reaction updatedReaction = reactionRepository.save(existingReaction);
            return ReactionResponseDto.fromEntity(updatedReaction);
        }

        Reaction newReaction = Reaction.builder()
                .reactionType(requestDto.getReactionType())
                .blogPost(blogPost)
                .user(user)
                .build();

        Reaction savedReaction = reactionRepository.save(newReaction);
        return ReactionResponseDto.fromEntity(savedReaction);
    }

    @Override
    public ReactionResponseDto reactToComment(ReactionRequestDto requestDto, User user) {

        if (requestDto.getBlogCommentId() == null) {
            throw new ApiException("BlogCommentId must be provided for reacting to a comment.");
        }
        
        validateReactionType(requestDto.getReactionType());

        BlogComment blogComment = blogCommentService.getBlogCommentEntity(requestDto.getBlogCommentId());

        Reaction existingReaction = reactionRepository.findByUserAndBlogComment(user, blogComment)
                .orElse(null);

        if (existingReaction != null) {
            existingReaction.setReactionType(requestDto.getReactionType());
            Reaction updatedReaction = reactionRepository.save(existingReaction);
            return ReactionResponseDto.fromEntity(updatedReaction);
        }

        Reaction newReaction = Reaction.builder()
                .reactionType(requestDto.getReactionType())
                .blogComment(blogComment)
                .user(user)
                .build();

        Reaction savedReaction = reactionRepository.save(newReaction);
        return ReactionResponseDto.fromEntity(savedReaction);
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

        return reactionRepository.findByBlogComment(blogComment).stream()
                .map(ReactionResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReaction(Long reactionId, User user) {
        Reaction reaction = reactionRepository.findById(reactionId)
                .orElseThrow(() -> new EntityNotFoundException("Reaction not found with ID: " + reactionId));

        // Ownership validation
        if (!reaction.getUser().getUsername().equals(user.getUsername())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to delete this reaction.")
                    .build();
        }

        reactionRepository.delete(reaction);
    }

    private void validateReactionType(ReactionType reactionType) {
        try {
            ReactionType.valueOf(reactionType.name());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ApiException("Invalid reaction type: " + reactionType);
        }
    }
}
