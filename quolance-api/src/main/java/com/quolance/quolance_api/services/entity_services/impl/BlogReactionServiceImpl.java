package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.BlogReactionType;
import com.quolance.quolance_api.repositories.blog.BlogReactionRepository;
import com.quolance.quolance_api.services.entity_services.BlogPostService;
import com.quolance.quolance_api.services.entity_services.BlogReactionService;
import com.quolance.quolance_api.services.entity_services.BlogCommentService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class BlogReactionServiceImpl implements BlogReactionService {

    private final BlogReactionRepository reactionRepository;
    private final BlogPostService blogPostService;
    private final BlogCommentService commentService;
    private final BlogCommentServiceImpl blogCommentServiceImpl;

    private void updateReactionCount(Map<BlogReactionType, Long> reactionCounts, BlogReactionType oldReaction, BlogReactionType newReaction) {
        if (oldReaction != null) {
            reactionCounts.put(oldReaction, reactionCounts.getOrDefault(oldReaction, 1L) - 1);
        }
        reactionCounts.put(newReaction, reactionCounts.getOrDefault(newReaction, 0L) + 1);
    }

    @Override
    public ReactionResponseDto reactToEntity(Long entityId, String entityType, User user, ReactionRequestDto request) {
        Reaction reaction;

        if ("post".equalsIgnoreCase(entityType)) {
            BlogPost post = blogPostService.getBlogPostEntity(entityId);
            reaction = reactionRepository.findByUserAndPost(user, post)
                    .orElseGet(() -> Reaction.builder().user(user).post(post).build());
            // Update or add the reaction
            updateReactionCount(post.getReactionCounts(), reaction.getReactionType(), request.getReactionType());
        } else if ("comment".equalsIgnoreCase(entityType)) {
            BlogComment comment = blogCommentServiceImpl.getCommentEntity(entityId);
            reaction = reactionRepository.findByUserAndComment(user, comment)
                    .orElseGet(() -> Reaction.builder().user(user).comment(comment).build());
            // Update or add the reaction
            updateReactionCount(comment.getReactionCounts(), reaction.getReactionType(), request.getReactionType());
        } else {
            throw new ApiException("Unsupported entity type: " + entityType);
        }

        reaction.setReactionType(request.getReactionType());
        Reaction savedReaction = reactionRepository.save(reaction);
        return ReactionResponseDto.fromEntity(savedReaction);
    }

    @Override
    public void removeReactionFromEntity(Long entityId, String entityType, User user) {
        Reaction reaction;

        if ("post".equalsIgnoreCase(entityType)) {
            BlogPost post = blogPostService.getBlogPostEntity(entityId);
            reaction = reactionRepository.findByUserAndPost(user, post)
                    .orElseThrow(() -> new ApiException("No reaction found for this post by the user"));
            updateReactionCount(post.getReactionCounts(), reaction.getReactionType(), null);
        } else if ("comment".equalsIgnoreCase(entityType)) {
            BlogComment comment = blogCommentServiceImpl.getCommentEntity(entityId);
            reaction = reactionRepository.findByUserAndComment(user, comment)
                    .orElseThrow(() -> new ApiException("No reaction found for this comment by the user"));
            updateReactionCount(comment.getReactionCounts(), reaction.getReactionType(), null);
        } else {
            throw new ApiException("Unsupported entity type: " + entityType);
        }

        reactionRepository.delete(reaction);
    }

    private Object getEntityByType(Long entityId, String entityType) {
        return switch (entityType.toLowerCase()) {
            case "post" -> blogPostService.getBlogPostEntity(entityId);
            case "comment" -> blogCommentServiceImpl.getCommentEntity(entityId);
            default -> throw new ApiException("Unsupported entity type: " + entityType);
        };
    }

    private ReactionResponseDto mapToResponseDto(Reaction reaction) {
        return ReactionResponseDto.builder()
                .reactionId(reaction.getId())
                .postId(reaction.getPost() != null ? reaction.getPost().getId() : null)
                .commentId(reaction.getComment() != null ? reaction.getComment().getId() : null)
                .reactionType(reaction.getReactionType())
                .username(reaction.getUser().getUsername())
                .build();
    }
}
