package com.quolance.quolance_api.services.entity_services.impl.blog;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.ReactionType;
import com.quolance.quolance_api.repositories.blog.ReactionRepository;
import com.quolance.quolance_api.services.entity_services.ReactionService;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReactionServiceImpl implements ReactionService {

    private final ReactionRepository reactionRepository;
    private final BlogPostService blogPostService;
    private final BlogCommentService blogCommentService;

    @Override
    public ReactionResponseDto reactToPost(ReactionRequestDto requestDto, User user) {
        log.info("User {} is reacting to blog post with ID: {}", user.getUsername(), requestDto.getBlogPostId());
        if (requestDto.getBlogPostId() == null) {
            log.warn("BlogPostId must be provided for reacting to a post. User: {}", user.getUsername());
            throw new ApiException("BlogPostId must be provided for reacting to a post.");
        }

        validateReactionType(requestDto.getReactionType());

        BlogPost blogPost = blogPostService.getBlogPostEntity(requestDto.getBlogPostId());
        log.debug("Found blog post with ID: {}", blogPost.getId());

        Reaction existingReaction = reactionRepository.findByUserAndBlogPost(user, blogPost)
                .orElse(null);

        if (existingReaction != null) {
            log.info("Updating reaction for user {} on blog post ID: {}", user.getUsername(), blogPost.getId());
            existingReaction.setReactionType(requestDto.getReactionType());
            Reaction updatedReaction = reactionRepository.save(existingReaction);
            return ReactionResponseDto.fromEntity(updatedReaction);
        }

        log.info("Creating new reaction for user {} on blog post ID: {}", user.getUsername(), blogPost.getId());
        Reaction newReaction = ReactionRequestDto.toEntity(requestDto);
        newReaction.setBlogPost(blogPost);
        newReaction.setUser(user);

        Reaction savedReaction = reactionRepository.save(newReaction);
        log.info("New reaction created for user {} on blog post ID: {}", user.getUsername(), blogPost.getId());
        return ReactionResponseDto.fromEntity(savedReaction);
    }

    @Override
    public ReactionResponseDto reactToComment(ReactionRequestDto requestDto, User user) {
        log.info("User {} is reacting to blog comment with ID: {}", user.getUsername(), requestDto.getBlogCommentId());

        if (requestDto.getBlogCommentId() == null) {
            log.warn("BlogCommentId must be provided for reacting to a comment. User: {}", user.getUsername());
            throw new ApiException("BlogCommentId must be provided for reacting to a comment.");
        }

        validateReactionType(requestDto.getReactionType());

        BlogComment blogComment = blogCommentService.getBlogCommentEntity(requestDto.getBlogCommentId());
        log.debug("Found blog comment with ID: {}", blogComment.getId());

        Reaction existingReaction = reactionRepository.findByUserAndBlogComment(user, blogComment)
                .orElse(null);

        if (existingReaction != null) {
            log.info("Updating reaction for user {} on blog comment ID: {}", user.getUsername(), blogComment.getId());
            existingReaction.setReactionType(requestDto.getReactionType());
            Reaction updatedReaction = reactionRepository.save(existingReaction);
            return ReactionResponseDto.fromEntity(updatedReaction);
        }

        log.info("Creating new reaction for user {} on blog comment ID: {}", user.getUsername(), blogComment.getId());
        Reaction newReaction = ReactionRequestDto.toEntity(requestDto);
        newReaction.setBlogComment(blogComment);
        newReaction.setUser(user);

        Reaction savedReaction = reactionRepository.save(newReaction);
        log.info("New reaction created for user {} on blog comment ID: {}", user.getUsername(), blogComment.getId());

        return ReactionResponseDto.fromEntity(savedReaction);
    }

    @Override
    public List<ReactionResponseDto> getReactionsByBlogPostId(UUID blogPostId) {
        log.info("Fetching reactions for blog post with ID: {}", blogPostId);
        BlogPost blogPost = blogPostService.getBlogPostEntity(blogPostId);

        List<ReactionResponseDto> reactions = reactionRepository.findByBlogPost(blogPost).stream()
                .map(ReactionResponseDto::fromEntity)
                .toList();
        log.debug("Found {} reactions for blog post ID: {}", reactions.size(), blogPostId);
        return reactions;
    }

    @Override
    public List<ReactionResponseDto> getReactionsByBlogCommentId(UUID blogCommentId) {
        log.info("Fetching reactions for blog comment with ID: {}", blogCommentId);
        BlogComment blogComment = blogCommentService.getBlogCommentEntity(blogCommentId);

        List<ReactionResponseDto> reactions = reactionRepository.findByBlogComment(blogComment).stream()
                .map(ReactionResponseDto::fromEntity)
                .toList();
        log.debug("Found {} reactions for blog comment ID: {}", reactions.size(), blogCommentId);
        return reactions;
    }

    @Override
    public void deleteReaction(UUID reactionId, User user) {
        log.info("User {} is attempting to delete reaction with ID: {}", user.getUsername(), reactionId);
        
        Reaction reaction = reactionRepository.findById(reactionId)
            .orElseThrow(() -> {
                log.error("Reaction with ID: {} not found.", reactionId);
                return new EntityNotFoundException("Reaction not found with ID: " + reactionId);
            });

        // Ownership validation
        if (!reaction.getUser().getUsername().equals(user.getUsername())) {
            log.warn("User {} is not authorized to delete reaction with ID: {}", user.getUsername(), reactionId);
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to delete this reaction.")
                    .build();
        }

        reactionRepository.delete(reaction);
        log.info("Reaction with ID: {} deleted by user {}", reactionId, user.getUsername());
    }

    private void validateReactionType(ReactionType reactionType) {
        try {
            log.debug("Validating reaction type: {}", reactionType);
            ReactionType.valueOf(reactionType.name());
        } catch (IllegalArgumentException | NullPointerException e) {
            log.warn("Invalid reaction type: {}", reactionType);
            throw new ApiException("Invalid reaction type: " + reactionType);
        }
    }
}
