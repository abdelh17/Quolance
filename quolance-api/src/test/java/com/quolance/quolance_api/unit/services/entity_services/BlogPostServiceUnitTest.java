package com.quolance.quolance_api.unit.services.entity_services;

import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.BlogTags;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import com.quolance.quolance_api.services.entity_services.impl.blog.BlogPostServiceImpl;
import com.quolance.quolance_api.util.exceptions.ApiException;
import com.quolance.quolance_api.util.exceptions.InvalidBlogTagException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BlogPostServiceUnitTest {

    @Mock
    private BlogPostRepository blogPostRepository;

    @InjectMocks
    private BlogPostServiceImpl blogPostService;

    private BlogPost blogPost;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create a mock blog post
        blogPost = new BlogPost();
        blogPost.setId(UUID.randomUUID());
        blogPost.setTags(Set.of(BlogTags.QUESTION));
    }

    @Test
    void testUpdateTagsForPost_ValidTags() {
        // Mock the repository call
        when(blogPostRepository.findById(blogPost.getId())).thenReturn(java.util.Optional.of(blogPost));
        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(blogPost);

        // Call the method
        Set<String> updatedTags = blogPostService.updateTagsForPost(blogPost.getId(), List.of("QUESTION", "SUPPORT"));

        // Verify the repository calls
        verify(blogPostRepository).findById(blogPost.getId());
        verify(blogPostRepository).save(any(BlogPost.class));

        // Capture the saved blog post
        ArgumentCaptor<BlogPost> blogPostCaptor = ArgumentCaptor.forClass(BlogPost.class);
        verify(blogPostRepository).save(blogPostCaptor.capture());

        // Assert the updated tags
        BlogPost savedBlogPost = blogPostCaptor.getValue();
        assertThat(savedBlogPost.getTags()).containsExactlyInAnyOrder(BlogTags.QUESTION, BlogTags.SUPPORT);
        assertThat(updatedTags).containsExactlyInAnyOrder("QUESTION", "SUPPORT");
    }

    @Test
    void testUpdateTagsForPost_InvalidTags() {
        // Mock the repository call
        when(blogPostRepository.findById(blogPost.getId())).thenReturn(java.util.Optional.of(blogPost));

        // Call the method with invalid tags
        assertThatThrownBy(() -> blogPostService.updateTagsForPost(blogPost.getId(), List.of("INVALID_TAG")))
                .isInstanceOf(InvalidBlogTagException.class)
                .hasMessageContaining("Invalid tags provided: INVALID_TAG");

        // Verify the repository is not saved
        verify(blogPostRepository, never()).save(any());
    }

    @Test
    void testUpdateTagsForPost_PostNotFound() {
        // Mock the repository call to return empty
        UUID nonExistentId = UUID.randomUUID();
        when(blogPostRepository.findById(nonExistentId)).thenReturn(java.util.Optional.empty());

        // Call the method with a non-existent post ID
        assertThatThrownBy(() -> blogPostService.updateTagsForPost(nonExistentId, List.of("QUESTION")))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("No blog post found with ID: " + nonExistentId);

        // Verify the repository is not saved
        verify(blogPostRepository, never()).save(any());
    }
}