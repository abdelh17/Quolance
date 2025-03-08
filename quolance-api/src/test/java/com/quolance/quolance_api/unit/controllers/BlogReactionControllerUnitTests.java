package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.blog.ReactionController;
import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ReactionType;
import com.quolance.quolance_api.services.entity_services.ReactionService;
import com.quolance.quolance_api.util.SecurityUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
class ReactionControllerUnitTest {

    @Mock
    private ReactionService reactionService;

    @InjectMocks
    private ReactionController reactionController;

    private ReactionRequestDto requestDto;
    private ReactionResponseDto responseDto;
    private User mockUser;
    private MockedStatic<SecurityUtil> securityUtilMockedStatic;

    @BeforeEach
    void setUp() {
        requestDto = new ReactionRequestDto();
        requestDto.setReactionType(ReactionType.LIKE);
        requestDto.setBlogPostId(UUID.randomUUID());
        requestDto.setBlogCommentId(null);

        responseDto = ReactionResponseDto.builder()
                .id(UUID.randomUUID())
                .userName("testUser")
                .reactionType(ReactionType.LIKE)
                .blogPostId(requestDto.getBlogPostId())
                .blogCommentId(requestDto.getBlogCommentId())
                .build();

        mockUser = new User();
        mockUser.setId(UUID.randomUUID());

        // Mock SecurityUtil
        securityUtilMockedStatic = mockStatic(SecurityUtil.class);
        securityUtilMockedStatic.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
    }

    @AfterEach
    void tearDown() {
        securityUtilMockedStatic.close();
    }

    @Test
    void reactToPost_ShouldReturnReactionResponse_WhenValidRequest() {
        when(reactionService.reactToPost(requestDto, mockUser)).thenReturn(responseDto);

        ResponseEntity<ReactionResponseDto> response = reactionController.reactToPost(requestDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().isEqualTo(responseDto);
        verify(reactionService).reactToPost(requestDto, mockUser);
        verifyNoMoreInteractions(reactionService);
    }

    @Test
    void reactToComment_ShouldReturnReactionResponse_WhenValidRequest() {
        requestDto.setBlogCommentId(UUID.randomUUID());
        when(reactionService.reactToComment(requestDto, mockUser)).thenReturn(responseDto);

        ResponseEntity<ReactionResponseDto> response = reactionController.reactToComment(requestDto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().isEqualTo(responseDto);
        verify(reactionService).reactToComment(requestDto, mockUser);
        verifyNoMoreInteractions(reactionService);
    }

    @Test
    void getReactionsByPost_ShouldReturnReactionsList_WhenReactionsExist() {
        UUID postId = UUID.randomUUID();
        List<ReactionResponseDto> reactions = List.of(responseDto);
        when(reactionService.getReactionsByBlogPostId(postId)).thenReturn(reactions);

        ResponseEntity<List<ReactionResponseDto>> response = reactionController.getReactionsByPost(postId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().isEqualTo(reactions);
        verify(reactionService).getReactionsByBlogPostId(postId);
        verifyNoMoreInteractions(reactionService);
    }

    @Test
    void getReactionsByComment_ShouldReturnReactionsList_WhenReactionsExist() {
        UUID commentId = UUID.randomUUID();
        List<ReactionResponseDto> reactions = List.of(responseDto);
        when(reactionService.getReactionsByBlogCommentId(commentId)).thenReturn(reactions);

        ResponseEntity<List<ReactionResponseDto>> response = reactionController.getReactionsByComment(commentId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().isEqualTo(reactions);
        verify(reactionService).getReactionsByBlogCommentId(commentId);
        verifyNoMoreInteractions(reactionService);
    }

    @Test
    void deleteReaction_ShouldReturnSuccessMessage_WhenValidRequest() {
        UUID reactionId = UUID.randomUUID();
        doNothing().when(reactionService).deleteReaction(reactionId, mockUser);

        ResponseEntity<String> response = reactionController.deleteReaction(reactionId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Reaction deleted successfully.");
        verify(reactionService).deleteReaction(reactionId, mockUser);
        verifyNoMoreInteractions(reactionService);
    }
}
