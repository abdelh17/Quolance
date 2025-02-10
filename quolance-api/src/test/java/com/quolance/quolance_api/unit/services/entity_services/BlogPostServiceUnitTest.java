package com.quolance.quolance_api.unit.services.entity_services;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogImage;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.BlogTags;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import com.quolance.quolance_api.services.entity_services.FileService;
import com.quolance.quolance_api.services.entity_services.impl.blog.BlogPostServiceImpl;
import com.quolance.quolance_api.util.exceptions.InvalidBlogTagException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BlogPostServiceUnitTest {

    @Mock
    private BlogPostRepository blogPostRepository;

    @Mock
    private FileService fileService;

    @InjectMocks
    private BlogPostServiceImpl blogPostService;

    private BlogPost blogPost;
    private User author;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create a mock user and blog post
        author = new User();
        author.setId(UUID.randomUUID());
        author.setUsername("testuser");

        blogPost = new BlogPost();
        blogPost.setId(UUID.randomUUID());
        blogPost.setUser(author);
        blogPost.setTags(Set.of(BlogTags.QUESTION));
    }

    @Test
    void testCreateBlogPostWithImages() {
        // Prepare mock request and uploaded files
        BlogPostRequestDto requestDto = new BlogPostRequestDto();
        requestDto.setTitle("Test Blog Post");
        requestDto.setContent("This is a test blog post.");
        requestDto.setTags(Set.of(BlogTags.SUPPORT));

        MultipartFile image1 = mock(MultipartFile.class);
        MultipartFile image2 = mock(MultipartFile.class);
        when(image1.getOriginalFilename()).thenReturn("image1.jpg");
        when(image2.getOriginalFilename()).thenReturn("image2.jpg");

        requestDto.setImages(new MultipartFile[]{image1, image2});

        // Mock file uploads
        when(fileService.uploadFile(image1, author)).thenReturn(Map.of("secure_url", "http://example.com/image1.jpg"));
        when(fileService.uploadFile(image2, author)).thenReturn(Map.of("secure_url", "http://example.com/image2.jpg"));

        // Mock the blog post save
        BlogPost mockSavedBlogPost = new BlogPost();
        mockSavedBlogPost.setId(UUID.randomUUID());
        mockSavedBlogPost.setTitle("Test Blog Post");
        mockSavedBlogPost.setContent("This is a test blog post.");
        mockSavedBlogPost.setUser(author);
        mockSavedBlogPost.setImages(List.of(
                BlogImage.builder()
                        .imagePath("http://example.com/image1.jpg")
                        .blogPost(mockSavedBlogPost)
                        .build(),
                BlogImage.builder()
                        .imagePath("http://example.com/image2.jpg")
                        .blogPost(mockSavedBlogPost)
                        .build()
        ));

        when(blogPostRepository.save(any(BlogPost.class))).thenReturn(mockSavedBlogPost);

        // Call the service method
        BlogPostResponseDto responseDto = blogPostService.create(requestDto, author);

        // Verify interactions
        verify(fileService).uploadFile(image1, author);
        verify(fileService).uploadFile(image2, author);
        verify(blogPostRepository).save(any(BlogPost.class));

        // Assert response contains the correct image URLs
        assertThat(responseDto.getImageUrls())
                .containsExactlyInAnyOrder("http://example.com/image1.jpg", "http://example.com/image2.jpg");
    }


    @Test
    void testGetBlogPostsByUserId() {
        // Mock repository behavior
        when(blogPostRepository.findByUserId(1L)).thenReturn(List.of(blogPost));

        // Call the service method
        List<BlogPostResponseDto> result = blogPostService.getBlogPostsByUserId(1L);

        // Verify interaction and result
        verify(blogPostRepository, times(1)).findByUserId(1L);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(blogPost.getId());
    }

    @Test
    void testUpdateBlogPost() {
        // Mock repository to return an existing post
        when(blogPostRepository.findById(1L)).thenReturn(Optional.of(blogPost));

        // Prepare the update request
        BlogPostUpdateDto updateDto = new BlogPostUpdateDto();
        updateDto.setPostId(1L);
        updateDto.setTitle("Updated Title");
        updateDto.setContent("Updated Content");

        // Call the service method
        blogPostService.update(updateDto, author);

        // Verify that the blog post is updated and saved
        ArgumentCaptor<BlogPost> captor = ArgumentCaptor.forClass(BlogPost.class);
        verify(blogPostRepository).save(captor.capture());

        BlogPost updatedBlogPost = captor.getValue();
        assertThat(updatedBlogPost.getTitle()).isEqualTo("Updated Title");
        assertThat(updatedBlogPost.getContent()).isEqualTo("Updated Content");
    }

    @Test
    void testUpdateTagsForPost_ValidTags() {
        // Mock the repository call
        when(blogPostRepository.findById(blogPost.getId())).thenReturn(Optional.of(blogPost));
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
    void testDeleteBlogPost() {
        // Mock repository behavior
        when(blogPostRepository.findById(blogPost.getId())).thenReturn(Optional.of(blogPost));

        // Call the delete method
        blogPostService.deletePost(blogPost.getId(), author);

        // Verify the interaction
        verify(blogPostRepository).deleteById(blogPost.getId());
    }
}
