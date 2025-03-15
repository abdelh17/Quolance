package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.blog.BlogCommentController;
import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.util.SecurityUtil;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogCommentControllerUnitTest {

    @Mock
    private BlogCommentService blogCommentService;

    @InjectMocks
    private BlogCommentController blogCommentController;

    private BlogCommentDto sampleComment;
    private User mockUser;
    private MockedStatic<SecurityUtil> securityUtilMockedStatic;

    @BeforeEach
    void setUp() {
        sampleComment = BlogCommentDto.builder()
                .commentId(UUID.randomUUID())
                .blogPostId(UUID.randomUUID())
                .userId(UUID.randomUUID())
                .username("testUser")
                .content("Sample comment content")
                .build();

        mockUser = new User();
        mockUser.setId(sampleComment.getUserId());

        // Mock SecurityUtil pour éviter NullPointerException
        securityUtilMockedStatic = mockStatic(SecurityUtil.class);
        securityUtilMockedStatic.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
    }

    @AfterEach
    void tearDown() {
        securityUtilMockedStatic.close();
    }

    @Test
    void createBlogComment_ShouldReturnComment_WhenValidRequest() {
        UUID postId = UUID.randomUUID();
        when(blogCommentService.createBlogComment(postId, mockUser, sampleComment)).thenReturn(sampleComment);

        ResponseEntity<BlogCommentDto> response = blogCommentController.createBlogComment(postId, sampleComment);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().isEqualTo(sampleComment);
        verify(blogCommentService).createBlogComment(postId, mockUser, sampleComment);
        verifyNoMoreInteractions(blogCommentService);
    }

    @Test
    void getCommentsByBlogPostId_ShouldReturnComments_WhenCommentsExist() {
        UUID blogPostId = UUID.randomUUID();
        Page<BlogCommentDto> commentPage = new PageImpl<>(List.of(sampleComment));
        when(blogCommentService.getPaginatedComments(blogPostId, Pageable.unpaged())).thenReturn(commentPage);

        ResponseEntity<Page<BlogCommentDto>> response = blogCommentController.getCommentsByBlogPostId(blogPostId, Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().isEqualTo(commentPage);
        verify(blogCommentService).getPaginatedComments(blogPostId, Pageable.unpaged());
        verifyNoMoreInteractions(blogCommentService);
    }

    @Test
    void updateBlogComment_ShouldReturnUpdatedComment_WhenValidRequest() {
        UUID commentId = UUID.randomUUID();
        when(blogCommentService.updateBlogComment(commentId, sampleComment, mockUser)).thenReturn(sampleComment);

        ResponseEntity<BlogCommentDto> response = blogCommentController.updateBlogComment(commentId, sampleComment);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().isEqualTo(sampleComment);
        verify(blogCommentService).updateBlogComment(commentId, sampleComment, mockUser);
        verifyNoMoreInteractions(blogCommentService);
    }

    @Test
    void deleteBlogComment_ShouldReturnSuccessMessage_WhenValidRequest() {
        UUID commentId = UUID.randomUUID();
        doNothing().when(blogCommentService).deleteBlogComment(commentId, mockUser);

        ResponseEntity<String> response = blogCommentController.deleteBlogComment(commentId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("The comment was successfully deleted");
        verify(blogCommentService).deleteBlogComment(commentId, mockUser);
        verifyNoMoreInteractions(blogCommentService);
    }
}
