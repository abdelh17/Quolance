package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.blog.BlogCommentController;
import com.quolance.quolance_api.controllers.blog.BlogPostController;
import com.quolance.quolance_api.controllers.blog.ReactionController;
import com.quolance.quolance_api.dtos.blog.*;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.BlogTags;
import com.quolance.quolance_api.entities.enums.ReactionType;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.entity_services.ReactionService;
import com.quolance.quolance_api.services.entity_services.blog.BlogCommentService;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.util.SecurityUtil;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogControllersUnitTest {

    @Mock
    private BlogPostService blogPostService;

    @Mock
    private BlogCommentService blogCommentService;

    @Mock
    private ReactionService reactionService;

    @InjectMocks
    private BlogPostController blogPostController;

    @InjectMocks
    private BlogCommentController blogCommentController;

    @InjectMocks
    private ReactionController reactionController;

    private User mockUser;
    private BlogPostRequestDto blogPostRequest;
    private BlogPostResponseDto blogPostResponse;
    private BlogCommentDto blogCommentDto;
    private ReactionRequestDto reactionRequest;
    private ReactionResponseDto reactionResponse;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("user@test.com");
        mockUser.setUsername("testUser");
        mockUser.setRole(Role.FREELANCER);

        Set<BlogTags> tags = new HashSet<>(Arrays.asList(BlogTags.FREELANCING, BlogTags.REMOTE_WORK));

        blogPostRequest = new BlogPostRequestDto();
        blogPostRequest.setTitle("Test Post");
        blogPostRequest.setContent("Test Content");
        blogPostRequest.setTags(tags);

        blogPostResponse = new BlogPostResponseDto();
        blogPostResponse.setId(UUID.randomUUID());
        blogPostResponse.setTitle("Test Post");
        blogPostResponse.setContent("Test Content");
        blogPostResponse.setAuthorName("testUser");
        blogPostResponse.setDateCreated(LocalDateTime.now());
        blogPostResponse.setTags(Set.of("FREELANCING", "REMOTE_WORK"));

        blogCommentDto = BlogCommentDto.builder()
                .commentId(UUID.randomUUID())
                .blogPostId(UUID.randomUUID())
                .userId(mockUser.getId())
                .content("Test Comment")
                .build();

        reactionRequest = new ReactionRequestDto();
        reactionRequest.setBlogPostId(UUID.randomUUID());
        reactionRequest.setReactionType(ReactionType.LIKE);

        reactionResponse = ReactionResponseDto.builder()
                .id(UUID.randomUUID())
                .userName(mockUser.getUsername())
                .reactionType(ReactionType.LIKE)
                .blogPostId(UUID.randomUUID())
                .build();
    }

    @Test
    void createBlogPost_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogPostService.create(eq(blogPostRequest), any(User.class)))
                    .thenReturn(blogPostResponse);

            ResponseEntity<BlogPostResponseDto> response = blogPostController.createBlogPost(blogPostRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getId()).isEqualTo(blogPostResponse.getId());
            assertThat(response.getBody().getTitle()).isEqualTo("Test Post");
            verify(blogPostService).create(blogPostRequest, mockUser);
        }
    }

    @Test
    void getBlogPostById_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogPostService.getBlogPost(blogPostResponse.getId())).thenReturn(blogPostResponse);

            ResponseEntity<BlogPostResponseDto> response = blogPostController.getBlogPostById(blogPostResponse.getId());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getId()).isEqualTo(blogPostResponse.getId());
            verify(blogPostService).getBlogPost(blogPostResponse.getId());
        }
    }

    @Test
    void getBlogPostById_WhenNotFound_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogPostService.getBlogPost(id))
                    .thenThrow(new ApiException("Blog post not found"));

            assertThatThrownBy(() -> blogPostController.getBlogPostById(id))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Blog post not found");
            verify(blogPostService).getBlogPost(id);
        }
    }

    @Test
    void updateBlogPost_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            BlogPostUpdateDto updateDto = new BlogPostUpdateDto(id, "Updated Title", "Updated Content");
            when(blogPostService.update(eq(updateDto), any(User.class))).thenReturn(blogPostResponse);

            ResponseEntity<BlogPostResponseDto> response = blogPostController.updateBlogPost(updateDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            verify(blogPostService).update(updateDto, mockUser);
        }
    }

    @Test
    void deleteBlogPost_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            doNothing().when(blogPostService).deletePost(id, mockUser);

            ResponseEntity<String> response = blogPostController.deleteBlogPost(id);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("The post was successfully deleted");
            verify(blogPostService).deletePost(id, mockUser);
        }
    }

    @Test
    void createBlogComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogCommentService.createBlogComment(eq(id), any(User.class), any(BlogCommentDto.class)))
                    .thenReturn(blogCommentDto);

            ResponseEntity<BlogCommentDto> response = blogCommentController.createBlogComment(id, blogCommentDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            verify(blogCommentService).createBlogComment(id, mockUser, blogCommentDto);
        }
    }

    @Test
    void updateBlogComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogCommentService
                    .updateBlogComment(eq(id), any(BlogCommentDto.class), eq(mockUser)))
                    .thenReturn(blogCommentDto);

            ResponseEntity<BlogCommentDto> response = blogCommentController.updateBlogComment(id, blogCommentDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            verify(blogCommentService).updateBlogComment(id, blogCommentDto, mockUser);
        }
    }

    @Test
    void deleteBlogComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            doNothing().when(blogCommentService).deleteBlogComment(id, mockUser);

            ResponseEntity<String> response = blogCommentController.deleteBlogComment(id);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("The comment was successfully deleted");
            verify(blogCommentService).deleteBlogComment(id, mockUser);
        }
    }

    @Test
    void reactToPost_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(reactionService.reactToPost(eq(reactionRequest), any(User.class)))
                    .thenReturn(reactionResponse);

            ResponseEntity<ReactionResponseDto> response = reactionController.reactToPost(reactionRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            verify(reactionService).reactToPost(reactionRequest, mockUser);
        }
    }

    @Test
    void reactToComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(reactionService.reactToComment(eq(reactionRequest), any(User.class)))
                    .thenReturn(reactionResponse);

            ResponseEntity<ReactionResponseDto> response = reactionController.reactToComment(reactionRequest);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            verify(reactionService).reactToComment(reactionRequest, mockUser);
        }
    }

    @Test
    void getReactionsByPost_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            List<ReactionResponseDto> expectedReactions = Arrays.asList(reactionResponse);
            when(reactionService.getReactionsByBlogPostId(id)).thenReturn(expectedReactions);

            ResponseEntity<List<ReactionResponseDto>> response = reactionController.getReactionsByPost(id);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull().hasSize(1);
            verify(reactionService).getReactionsByBlogPostId(id);
        }
    }

    @Test
    void getReactionsByComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            List<ReactionResponseDto> expectedReactions = Arrays.asList(reactionResponse);
            when(reactionService.getReactionsByBlogCommentId(blogCommentDto.getCommentId())).thenReturn(expectedReactions);

            ResponseEntity<List<ReactionResponseDto>> response = reactionController.getReactionsByComment(blogCommentDto.getCommentId());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull().hasSize(1);
            verify(reactionService).getReactionsByBlogCommentId(blogCommentDto.getCommentId());
        }
    }

    @Test
    void deleteReaction_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID id = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            doNothing().when(reactionService).deleteReaction(id, mockUser);

            ResponseEntity<String> response = reactionController.deleteReaction(id);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Reaction deleted successfully.");
            verify(reactionService).deleteReaction(id, mockUser);
        }
    }
}