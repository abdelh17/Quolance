package com.quolance.quolance_api.unit.controllers.blog;

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
import org.springframework.security.access.AccessDeniedException;

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
        mockUser.setId(1L);
        mockUser.setEmail("user@test.com");
        mockUser.setUsername("testUser");
        mockUser.setRole(Role.FREELANCER);

        Set<BlogTags> tags = new HashSet<>(Arrays.asList(BlogTags.FREELANCING, BlogTags.REMOTE_WORK));

        blogPostRequest = new BlogPostRequestDto();
        blogPostRequest.setTitle("Test Post");
        blogPostRequest.setContent("Test Content");
        blogPostRequest.setTags(tags);

        blogPostResponse = new BlogPostResponseDto();
        blogPostResponse.setId(1L);
        blogPostResponse.setTitle("Test Post");
        blogPostResponse.setContent("Test Content");
        blogPostResponse.setAuthorName("testUser");
        blogPostResponse.setDateCreated(LocalDateTime.now());
        blogPostResponse.setTags(Set.of("FREELANCING", "REMOTE_WORK"));

        blogCommentDto = BlogCommentDto.builder()
                .commentId(1L)
                .blogPostId(1L)
                .userId(mockUser.getId())
                .content("Test Comment")
                .build();

        reactionRequest = new ReactionRequestDto();
        reactionRequest.setBlogPostId(1L);
        reactionRequest.setReactionType(ReactionType.LIKE);

        reactionResponse = ReactionResponseDto.builder()
                .id(1L)
                .userName(mockUser.getUsername())
                .reactionType(ReactionType.LIKE)
                .blogPostId(1L)
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
            assertThat(response.getBody().getId()).isEqualTo(1L);
            assertThat(response.getBody().getTitle()).isEqualTo("Test Post");
            verify(blogPostService).create(blogPostRequest, mockUser);
        }
    }

    @Test
    void getAllBlogPosts_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            List<BlogPostResponseDto> expectedPosts = Arrays.asList(blogPostResponse);
            when(blogPostService.getAll()).thenReturn(expectedPosts);

            ResponseEntity<List<BlogPostResponseDto>> response = blogPostController.getAllBlogPosts();

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull().hasSize(1);
            verify(blogPostService).getAll();
        }
    }

    @Test
    void getBlogPostById_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogPostService.getBlogPost(1L)).thenReturn(blogPostResponse);

            ResponseEntity<BlogPostResponseDto> response = blogPostController.getBlogPostById(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getId()).isEqualTo(1L);
            verify(blogPostService).getBlogPost(1L);
        }
    }

    @Test
    void getBlogPostById_WhenNotFound_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogPostService.getBlogPost(999L))
                    .thenThrow(new ApiException("Blog post not found"));

            assertThatThrownBy(() -> blogPostController.getBlogPostById(999L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Blog post not found");
            verify(blogPostService).getBlogPost(999L);
        }
    }

    @Test
    void updateBlogPost_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            BlogPostUpdateDto updateDto = new BlogPostUpdateDto(1L, "Updated Title", "Updated Content");
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
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            doNothing().when(blogPostService).deletePost(1L, mockUser);

            ResponseEntity<String> response = blogPostController.deleteBlogPost(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("The post was successfully deleted");
            verify(blogPostService).deletePost(1L, mockUser);
        }
    }

    @Test
    void createBlogComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogCommentService.createBlogComment(eq(1L), any(User.class), any(BlogCommentDto.class)))
                    .thenReturn(blogCommentDto);

            ResponseEntity<BlogCommentDto> response = blogCommentController.createBlogComment(1L, blogCommentDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            verify(blogCommentService).createBlogComment(1L, mockUser, blogCommentDto);
        }
    }

    @Test
    void getCommentsByBlogPostId_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            List<BlogCommentDto> expectedComments = Arrays.asList(blogCommentDto);
            when(blogCommentService.getCommentsByBlogPostId(1L)).thenReturn(expectedComments);

            ResponseEntity<List<BlogCommentDto>> response = blogCommentController.getCommentsByBlogPostId(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull().hasSize(1);
            verify(blogCommentService).getCommentsByBlogPostId(1L);
        }
    }

    @Test
    void updateBlogComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(blogCommentService.updateBlogComment(eq(1L), any(BlogCommentDto.class)))
                    .thenReturn(blogCommentDto);

            ResponseEntity<BlogCommentDto> response = blogCommentController.updateBlogComment(1L, blogCommentDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            verify(blogCommentService).updateBlogComment(1L, blogCommentDto);
        }
    }

    @Test
    void deleteBlogComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            doNothing().when(blogCommentService).deleteBlogComment(1L);

            ResponseEntity<String> response = blogCommentController.deleteBlogComment(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("The comment was successfully deleted");
            verify(blogCommentService).deleteBlogComment(1L);
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
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            List<ReactionResponseDto> expectedReactions = Arrays.asList(reactionResponse);
            when(reactionService.getReactionsByBlogPostId(1L)).thenReturn(expectedReactions);

            ResponseEntity<List<ReactionResponseDto>> response = reactionController.getReactionsByPost(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull().hasSize(1);
            verify(reactionService).getReactionsByBlogPostId(1L);
        }
    }

    @Test
    void getReactionsByComment_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            List<ReactionResponseDto> expectedReactions = Arrays.asList(reactionResponse);
            when(reactionService.getReactionsByBlogCommentId(1L)).thenReturn(expectedReactions);

            ResponseEntity<List<ReactionResponseDto>> response = reactionController.getReactionsByComment(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull().hasSize(1);
            verify(reactionService).getReactionsByBlogCommentId(1L);
        }
    }

    @Test
    void deleteReaction_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            doNothing().when(reactionService).deleteReaction(1L, mockUser);

            ResponseEntity<String> response = reactionController.deleteReaction(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Reaction deleted successfully.");
            verify(reactionService).deleteReaction(1L, mockUser);
        }
    }
}