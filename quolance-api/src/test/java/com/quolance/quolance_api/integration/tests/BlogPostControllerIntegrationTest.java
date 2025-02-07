package com.quolance.quolance_api.integration.tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.BlogImage;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class BlogPostControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User loggedInUser;

    @BeforeEach
    void setUp() throws Exception {
        blogPostRepository.deleteAll();
        userRepository.deleteAll();
        loggedInUser = userRepository.save(EntityCreationHelper.createClient());
        session = sessionCreationHelper.getSession(loggedInUser.getEmail(), "Password123!");
    }

    @Test
    void testCreateBlogPostWithImages() throws Exception {
        MockMultipartFile image1 = new MockMultipartFile("images", "test-image1.jpg", "image/jpeg", "Image 1 Content".getBytes());
        MockMultipartFile image2 = new MockMultipartFile("images", "test-image2.jpg", "image/jpeg", "Image 2 Content".getBytes());

        mockMvc.perform(multipart("/api/blog-posts")
                        .file(image1)
                        .file(image2)
                        .param("title", "Integration Test Post")
                        .param("content", "This is a blog post with images.")
                        .session(session)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Integration Test Post"))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.imageUrls", org.hamcrest.Matchers.hasSize(2))); // Verify image count in response

        // Verify the blog post was saved with BlogImage entities
        BlogPost savedPost = blogPostRepository.findAll().getFirst();
        assertThat(savedPost.getImages()).hasSize(2);

        // Verify the image paths inside the BlogImage entities
        List<BlogImage> savedImages = savedPost.getImages();
        assertThat(savedImages.get(0).getImagePath()).isNotBlank();
        assertThat(savedImages.get(1).getImagePath()).isNotBlank();
    }

    @Test
    void testCreateBlogPostInvalidRequest() throws Exception {
        BlogPostRequestDto request = new BlogPostRequestDto();
        request.setContent("Missing title field");  // Missing required "title"

        mockMvc.perform(post("/api/blog-posts")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message").value("Unprocessable entity"));
    }

    @Test
    void testGetAllBlogPosts() throws Exception {
        blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        mockMvc.perform(get("/api/blog-posts/all")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetBlogPostByIdIsOk() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPostWithImages(loggedInUser));

        mockMvc.perform(get("/api/blog-posts/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(blogPost.getTitle()))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.imageUrls", org.hamcrest.Matchers.hasSize(2))); // Ensure 2 images in response
    }

    @Test
    void testUpdateBlogPost() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        BlogPostUpdateDto update = new BlogPostUpdateDto();
        update.setPostId(blogPost.getId());
        update.setTitle("Updated Title");
        update.setContent("Updated Content");

        mockMvc.perform(put("/api/blog-posts/update")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk());

        BlogPost updatedPost = blogPostRepository.findById(blogPost.getId()).orElseThrow();
        assertThat(updatedPost.getTitle()).isEqualTo("Updated Title");
        assertThat(updatedPost.getContent()).isEqualTo("Updated Content");
    }

    @Test
    void testDeleteBlogPostWithImages() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPostWithImages(loggedInUser));

        mockMvc.perform(delete("/api/blog-posts/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertThat(blogPostRepository.findById(blogPost.getId())).isEmpty();
    }

    @Test
    void testDeleteBlogPostWithoutImages() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        mockMvc.perform(delete("/api/blog-posts/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertThat(blogPostRepository.findById(blogPost.getId())).isEmpty();
    }
}
