package com.quolance.quolance_api.unit.services.entity_services;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.ReactionType;
import com.quolance.quolance_api.repositories.blog.ReactionRepository;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.services.entity_services.impl.blog.ReactionServiceImpl;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReactionServiceUnitTest {

    @Mock
    private ReactionRepository reactionRepository;

    @Mock
    private BlogPostService blogPostService;

    @Mock
    private BlogCommentService blogCommentService;

    @InjectMocks
    private ReactionServiceImpl reactionService;

    private User mockUser;
    private User anotherUser;
    private BlogPost blogPost;
    private BlogComment blogComment;
    private Reaction reaction;
    private UUID reactionId;
    private UUID blogPostId;
    private UUID blogCommentId;

    @BeforeEach
    void setUp() {
        reactionId = UUID.randomUUID();
        blogPostId = UUID.randomUUID();
        blogCommentId = UUID.randomUUID();
        
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setUsername("testUser");
        
        anotherUser = new User();
        anotherUser.setId(UUID.randomUUID());
        anotherUser.setUsername("anotherUser");
        
        blogPost = new BlogPost();
        blogPost.setId(blogPostId);
        
        blogComment = new BlogComment();
        blogComment.setId(blogCommentId);
        
        reaction = new Reaction();
        reaction.setId(reactionId);
        reaction.setUser(mockUser);
        reaction.setReactionType(ReactionType.LIKE);
        reaction.setBlogPost(blogPost);
    }

    @Test
    void reactToPost_ShouldCreateReaction_WhenValidRequest() {
        ReactionRequestDto requestDto = new ReactionRequestDto(ReactionType.LIKE, blogPostId, null);
        
        when(blogPostService.getBlogPostEntity(blogPostId)).thenReturn(blogPost);
        when(reactionRepository.save(any(Reaction.class))).thenReturn(reaction);

        ReactionResponseDto result = reactionService.reactToPost(requestDto, mockUser);

        assertThat(result).isNotNull();
        verify(reactionRepository).save(any(Reaction.class));
        verify(blogPostService).getBlogPostEntity(blogPostId);
    }

    @Test
    void reactToComment_ShouldCreateReaction_WhenValidRequest() {
        ReactionRequestDto requestDto = new ReactionRequestDto(ReactionType.LIKE, null, blogCommentId);
        Reaction commentReaction = new Reaction();
        commentReaction.setId(UUID.randomUUID());
        commentReaction.setUser(mockUser);
        commentReaction.setReactionType(ReactionType.LIKE);
        commentReaction.setBlogComment(blogComment);
        
        when(blogCommentService.getBlogCommentEntity(blogCommentId)).thenReturn(blogComment);
        when(reactionRepository.save(any(Reaction.class))).thenReturn(commentReaction);

        ReactionResponseDto result = reactionService.reactToComment(requestDto, mockUser);

        assertThat(result).isNotNull();
        verify(reactionRepository).save(any(Reaction.class));
        verify(blogCommentService).getBlogCommentEntity(blogCommentId);
    }

    @Test
    void getReactionsByBlogPostId_ShouldReturnReactions() {
        when(blogPostService.getBlogPostEntity(blogPostId)).thenReturn(blogPost);
        when(reactionRepository.findByBlogPost(blogPost)).thenReturn(List.of(reaction));

        List<ReactionResponseDto> result = reactionService.getReactionsByBlogPostId(blogPostId);

        assertThat(result).hasSize(1);
        verify(blogPostService).getBlogPostEntity(blogPostId);
        verify(reactionRepository).findByBlogPost(blogPost);
    }

    @Test
    void deleteReaction_ShouldRemoveReaction_WhenUserIsOwner() {
        when(reactionRepository.findById(reactionId)).thenReturn(Optional.of(reaction));
        doNothing().when(reactionRepository).delete(reaction);

        reactionService.deleteReaction(reactionId, mockUser);

        verify(reactionRepository).delete(reaction);
    }

    @Test
    void deleteReaction_ShouldThrowException_WhenUserIsNotOwner() {
        Reaction ownerReaction = new Reaction();
        ownerReaction.setId(reactionId);
        ownerReaction.setUser(mockUser);
        
        when(reactionRepository.findById(reactionId)).thenReturn(Optional.of(ownerReaction));

        assertThatThrownBy(() -> reactionService.deleteReaction(reactionId, anotherUser))
                .isInstanceOf(ApiException.class)
                .hasMessage("You are not authorized to delete this reaction.");
    }

    @Test
    void deleteReaction_ShouldThrowException_WhenReactionNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(reactionRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reactionService.deleteReaction(nonExistentId, mockUser))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Reaction not found with ID:");
    }
}