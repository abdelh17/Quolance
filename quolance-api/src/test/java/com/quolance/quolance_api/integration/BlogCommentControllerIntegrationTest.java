package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.repositories.blog.BlogCommentRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.entity_services.BlogCommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class BlogCommentControllerIntegrationTest extends AbstractTestcontainers {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogCommentRepository blogCommentRepository;

    @Autowired
    private BlogCommentService blogCommentService;


    @Autowired
    private UserRepository userRepository;

    private MockHttpSession session;
    private User loggedInUser;
    private BlogPost blogPost;
    private BlogComment blogComment;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @BeforeEach
    void setUp() throws Exception {
        blogCommentRepository.deleteAll();
        blogPostRepository.deleteAll();

        // Find and delete the specific test user if it exists
        userRepository.findByUsername("test_user").ifPresent(userRepository::delete);

        // Create the test user
        loggedInUser = userRepository.save(
                User.builder()
                        .firstName("John")
                        .lastName("Doe")
                        .username("test_user") // Use a consistent username for the test user
                        .email("test-user@example.com")
                        .password(passwordEncoder.encode("Password123!"))
                        .role(Role.CLIENT)
                        .build()
        );

        blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));
        blogComment = blogCommentRepository.save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));
        session = getSession(loggedInUser.getEmail(), "Password123!");
    }

    @Test
    void testCreateBlogCommentIsOk() throws Exception {
        BlogCommentDto commentDto = new BlogCommentDto();
        commentDto.setContent("This is a valid comment");
        commentDto.setBlogPostId(blogPost.getId());
        commentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(post("/api/blog-comments/" + blogPost.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentDto))
                        .session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateBlogCommentInvalidRequest() throws Exception {
        BlogCommentDto blogCommentDto = new BlogCommentDto();
        blogCommentDto.setContent("");
        blogCommentDto.setBlogPostId(blogPost.getId());
        blogCommentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(post("/api/blog-comments/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(blogCommentDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetAllCommentsForBlogPost() throws Exception {
        blogCommentRepository.save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        mockMvc.perform(get("/api/blog-comments/post/" + blogPost.getId())
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
        BlogCommentDto updatedCommentDto = new BlogCommentDto();
        updatedCommentDto.setContent("Updated Comment Content");

        mockMvc.perform(put("/api/blog-comments/" + blogComment.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCommentDto)))
                .andExpect(status().isOk());

        // Fetch the updated comment
        BlogComment updatedComment = blogCommentRepository.findById(blogComment.getId())
                .orElseThrow(() -> new AssertionError("Comment not found"));

        assertThat(updatedComment.getContent()).isEqualTo("Updated Comment Content");
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
