package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.quolance.quolance_api.entities.BlogPost;


@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class BlogPostControllerIntegrationTest extends AbstractTestcontainers {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    private MockHttpSession session;
    private User loggedInUser;

    @BeforeEach
    void setUp() throws Exception {
        blogPostRepository.deleteAll();
        userRepository.deleteAll();

        loggedInUser = userRepository.save(EntityCreationHelper.createClient());
        session = getSession(loggedInUser.getEmail(), "Password123!");
    }

    @Test
    void testCreateBlogPostIsOk() throws Exception {
        BlogPostRequestDto request = new BlogPostRequestDto();
        request.setTitle("New Blog Post");
        request.setContent("This is a test content");

        mockMvc.perform(post("/api/blog-posts")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        assertThat(blogPostRepository.findAll().size()).isEqualTo(1);
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
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        mockMvc.perform(get("/api/blog-posts/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
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

        BlogPostRequestDto request = new BlogPostRequestDto();
        request.setTitle("Updated Title");
        request.setContent("Updated Content");

        mockMvc.perform(put("/api/blog-posts/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        BlogPost updatedPost = blogPostRepository.findById(blogPost.getId()).orElseThrow();
        assertThat(updatedPost.getContent()).isEqualTo("Updated Content");
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

    @Test
    void testGetPaginatedBlogPosts() throws Exception {
        blogPostRepository.saveAll(List.of(
                EntityCreationHelper.createBlogPost(loggedInUser),
                EntityCreationHelper.createBlogPost(loggedInUser)
        ));

        mockMvc.perform(get("/api/blog-posts?page=0&size=1")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    private MockHttpSession getSession(String email, String password) throws Exception {
        // Log in and return the session
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        return (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getRequest()
                .getSession();
    }
}
