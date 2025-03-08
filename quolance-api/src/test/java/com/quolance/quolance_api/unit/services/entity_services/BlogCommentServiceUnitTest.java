package com.quolance.quolance_api.unit.services.entity_services;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.repositories.blog.BlogCommentRepository;
import com.quolance.quolance_api.services.entity_services.blog.BlogPostService;
import com.quolance.quolance_api.services.entity_services.impl.blog.BlogCommentServiceImpl;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogCommentServiceUnitTest {

    @Mock
    private BlogCommentRepository blogCommentRepository;

    @Mock
    private BlogPostService blogPostService;

    @InjectMocks
    private BlogCommentServiceImpl blogCommentService;

    private User author;
    private BlogPost blogPost;
    private BlogComment blogComment;
    private BlogCommentDto blogCommentDto;

    @BeforeEach
    void setUp() {
        // Only set up common mock data here, not specific behaviors
        author = new User();
        author.setId(UUID.randomUUID());
    
        blogPost = new BlogPost();
        blogPost.setId(UUID.randomUUID());
        blogPost.setUser(author);
    
        blogComment = new BlogComment();
        blogComment.setId(UUID.randomUUID());
        blogComment.setUser(author);
        blogComment.setBlogPost(blogPost);
        blogComment.setContent("Test comment");
    
        blogCommentDto = BlogCommentDto.fromEntity(blogComment);
    }
    
    @Test
    void createBlogComment_ShouldReturnComment_WhenValidRequest() {
        // Set up specific mocks for this test
        when(blogPostService.getBlogPostEntity(blogPost.getId())).thenReturn(blogPost);
        when(blogCommentRepository.save(any(BlogComment.class))).thenAnswer(invocation -> {
            BlogComment savedComment = invocation.getArgument(0);
            savedComment.setId(UUID.randomUUID()); // Ensure ID is set
            return savedComment;
        });
    
        BlogCommentDto result = blogCommentService.createBlogComment(blogPost.getId(), author, blogCommentDto);
    
        assertThat(result).isNotNull();
        verify(blogCommentRepository).save(any(BlogComment.class));
    }
    
    @Test
    void createBlogComment_ShouldThrowException_WhenContentIsEmpty() {
        // Only set up mocks needed for this test
        blogCommentDto.setContent("");
        
        assertThatThrownBy(() -> blogCommentService.createBlogComment(blogPost.getId(), author, blogCommentDto))
                .isInstanceOf(ApiException.class)
                .hasMessage("Comment content cannot be empty");
    }
    
    @Test
    void updateBlogComment_ShouldThrowException_WhenCommentNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(blogCommentRepository.findById(nonExistentId)).thenReturn(Optional.empty());
    
        assertThatThrownBy(() -> blogCommentService.updateBlogComment(nonExistentId, blogCommentDto, author))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("BlogComment not found with ID:");
    }
    
    @Test
    void getCommentsByBlogPostId_ShouldReturnComments_WhenExist() {
        // Make sure to set up necessary mocks for this test
        when(blogPostService.getBlogPostEntity(blogPost.getId())).thenReturn(blogPost);
        when(blogCommentRepository.findByBlogPost(blogPost)).thenReturn(List.of(blogComment));
    
        List<BlogCommentDto> result = blogCommentService.getCommentsByBlogPostId(blogPost.getId());
    
        assertThat(result).isNotEmpty().hasSize(1);
        verify(blogCommentRepository).findByBlogPost(blogPost);
    }
    
    @Test
    void getPaginatedComments_ShouldReturnPageOfComments() {
        Pageable pageable = mock(Pageable.class);
        Page<BlogComment> commentPage = new PageImpl<>(List.of(blogComment));
        
        when(blogCommentRepository.findByBlogPostId(blogPost.getId(), pageable)).thenReturn(commentPage);
    
        Page<BlogCommentDto> result = blogCommentService.getPaginatedComments(blogPost.getId(), pageable);
    
        assertThat(result).isNotEmpty();
        verify(blogCommentRepository).findByBlogPostId(blogPost.getId(), pageable);
    }
}