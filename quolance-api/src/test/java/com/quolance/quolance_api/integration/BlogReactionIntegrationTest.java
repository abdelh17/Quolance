package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.BlogReactionType;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.blog.BlogCommentRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import com.quolance.quolance_api.repositories.blog.BlogReactionRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class BlogReactionIntegrationTest extends AbstractTestcontainers {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogCommentRepository blogCommentRepository;

    @Autowired
    private BlogReactionRepository reactionRepository;

    @Autowired
    private UserRepository userRepository;

    private MockHttpSession session;
    private User loggedInUser;
    private BlogPost blogPost;
    private BlogComment blogComment;

    @BeforeEach
    void setUp() throws Exception {
        // Delete related entities first
        reactionRepository.deleteAll();
        blogCommentRepository.deleteAll();
        blogPostRepository.deleteAll();
        userRepository.deleteAll();

        // Create test data
        loggedInUser = userRepository.save(EntityCreationHelper.createClient());
        blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));
        blogComment = blogCommentRepository.save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));
        session = getSession(loggedInUser.getEmail(), "Password123!");
    }

    @Test
    void testAddReactionToPost() throws Exception {
        ReactionRequestDto reactionRequest = new ReactionRequestDto();
        reactionRequest.setReactionType(BlogReactionType.valueOf("LIKE"));

        mockMvc.perform(post("/api/reactions/post/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reactionRequest)))
                .andExpect(status().isOk());

        assertThat(reactionRepository.findAll()).hasSize(1);
    }

    @Test
    void testAddReactionToComment() throws Exception {
        ReactionRequestDto reactionRequest = new ReactionRequestDto();
        reactionRequest.setReactionType(BlogReactionType.valueOf("HEART"));

        mockMvc.perform(post("/api/reactions/comment/" + blogComment.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reactionRequest)))
                .andExpect(status().isOk());

        assertThat(reactionRepository.findAll()).hasSize(1);
    }

    @Test
    void testUpdateReactionForPost() throws Exception {
        // Add a reaction first
        ReactionRequestDto reactionRequest = new ReactionRequestDto();
        reactionRequest.setReactionType(BlogReactionType.valueOf("LIKE"));

        mockMvc.perform(post("/api/reactions/post/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reactionRequest)))
                .andExpect(status().isOk());

        // Update the reaction
        reactionRequest.setReactionType(BlogReactionType.valueOf("ANGRY"));
        mockMvc.perform(post("/api/reactions/post/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reactionRequest)))
                .andExpect(status().isOk());

        assertThat(reactionRepository.findAll().getFirst().getReactionType()).isEqualTo(BlogReactionType.valueOf("ANGRY"));
    }

    @Test
    void testRemoveReactionFromPost() throws Exception {
        // Add a reaction first
        ReactionRequestDto reactionRequest = new ReactionRequestDto();
        reactionRequest.setReactionType(BlogReactionType.valueOf("LIKE"));

        mockMvc.perform(post("/api/reactions/post/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reactionRequest)))
                .andExpect(status().isOk());

        // Remove the reaction
        mockMvc.perform(delete("/api/reactions/post/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertThat(reactionRepository.findAll()).isEmpty();
    }

    @Test
    void testInvalidEntityType() throws Exception {
        ReactionRequestDto reactionRequest = new ReactionRequestDto();
        reactionRequest.setReactionType(BlogReactionType.valueOf("LIKE"));

        mockMvc.perform(post("/api/reactions/invalidType/123")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reactionRequest)))
                .andExpect(status().isBadRequest());
    }

    private MockHttpSession getSession(String email, String password) throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername(email);
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