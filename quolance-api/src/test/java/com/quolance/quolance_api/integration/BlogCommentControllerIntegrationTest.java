package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.BlogCommentDto;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.repositories.BlogCommentRepository;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.entity_services.BlogCommentService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class BlogCommentControllerIntegrationTest extends AbstractTestcontainers {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogCommentRepository blogCommentRepository;

    @MockBean
    private BlogCommentService blogCommentService; // Mock the service


    @Autowired
    private UserRepository userRepository;

    private MockHttpSession session;
    private User loggedInUser;
    private BlogPost blogPost;

    @BeforeEach
    void setUp() throws Exception {
        blogPostRepository.deleteAll();
        blogCommentRepository.deleteAll();
        userRepository.deleteAll();

        loggedInUser = userRepository.save(EntityCreationHelper.createClient());
        blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));
        session = getSession(loggedInUser.getEmail(), "Password123!");
    }

    @Test
    void testCreateBlogCommentIsOk() throws Exception {
        BlogCommentDto commentDto = new BlogCommentDto();
        commentDto.setContent("This is a valid comment");
        commentDto.setBlogPostId(blogPost.getId());
        commentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(post("/api/blog-comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentDto))
                .session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateBlogCommentInvalidRequest() throws Exception {
        BlogCommentDto request = new BlogCommentDto();
        request.setContent(""); // Empty comment content
        request.setBlogPostId(blogPost.getId());
        request.setUserId(loggedInUser.getId());

        mockMvc.perform(post("/api/blog-comments")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity()); // Expect 422
    }

    @Test
    void testGetAllCommentsForBlogPost() throws Exception {
        BlogComment blogComment = blogCommentRepository
                .save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        mockMvc.perform(get("/api/blog-comments/post/" + blogPost.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testGetCommentByIdIsOk() throws Exception {
        BlogComment blogComment = blogCommentRepository
                .save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        mockMvc.perform(get("/api/blog-comments/" + blogComment.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteBlogComment() throws Exception {
        BlogComment blogComment = blogCommentRepository
                .save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        mockMvc.perform(delete("/api/blog-comments/" + blogComment.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertThat(blogCommentRepository.findById(blogComment.getId())).isEmpty();
    }

    @Test
    void testUpdateBlogComment() throws Exception {
        BlogComment blogComment = blogCommentRepository
                .save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        BlogCommentDto request = new BlogCommentDto();
        request.setContent("Updated Comment Content");
        request.setBlogPostId(blogPost.getId());
        request.setUserId(loggedInUser.getId());

        mockMvc.perform(put("/api/blog-comments/" + blogComment.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        BlogComment updatedComment = blogCommentRepository.findById(blogComment.getId()).orElseThrow();
        assertThat(updatedComment.getContent()).isEqualTo("Updated Comment Content");
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
