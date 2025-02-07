package com.quolance.quolance_api.integration.tests;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.util.List;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


class BlogPostControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    private User loggedInUser;


    @BeforeEach
    void setUp() throws Exception {
        blogPostRepository.deleteAll();
        userRepository.deleteAll();

        loggedInUser = userRepository.save(EntityCreationHelper.createClient());

        session = sessionCreationHelper.getSession(loggedInUser.getEmail(), "Password123!");
    }

    @Test
    void testCreateBlogPostInvalidRequest() throws Exception {
        BlogPostRequestDto request = new BlogPostRequestDto();
        request.setContent("Missing title field");

        mockMvc.perform(post("/api/blog-posts")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void testGetAllBlogPosts() throws Exception {

        blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        mockMvc.perform(get("/api/blog-posts/all")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testGetBlogPostByIdIsOk() throws Exception {
        // Create and save a blog post
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        // Manually associate image paths with the blog post
        blogPost.getImagePaths().add("https://example.com/image1.jpg");
        blogPost.getImagePaths().add("https://example.com/image2.jpg");
        blogPostRepository.save(blogPost);

        // Perform GET request and validate image URLs
        mockMvc.perform(get("/api/blog-posts/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(blogPost.getTitle()))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.imageUrls[0]").value("https://example.com/image1.jpg"))
                .andExpect(jsonPath("$.imageUrls[1]").value("https://example.com/image2.jpg"));
    }


    @Test
    void testGetBlogPostByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/blog-posts/999")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
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

        BlogPost updatedPost = blogPostRepository.findAll().getFirst();
        assertThat(updatedPost.getContent()).isEqualTo("Updated Content");
        assertThat(updatedPost.getTitle()).isEqualTo("Updated Title");
    }

    @Test
    void testGetBlogPostsByUserId() throws Exception {
        blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        mockMvc.perform(get("/api/blog-posts/user/" + loggedInUser.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteBlogPost() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        mockMvc.perform(delete("/api/blog-posts/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertThat(blogPostRepository.findById(blogPost.getId())).isEmpty();
    }




}
