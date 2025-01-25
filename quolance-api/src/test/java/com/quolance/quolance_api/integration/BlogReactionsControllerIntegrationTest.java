package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ReactionTypeConstants;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.repositories.BlogCommentRepository;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.repositories.ReactionRepository;
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

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class BlogReactionsControllerIntegrationTest extends AbstractTestcontainers {

    
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogCommentRepository blogCommentRepository;

    @Autowired
    private UserRepository userRepository;

    private MockHttpSession session;
    private User loggedInUser;
    private BlogPost blogPost;
    private BlogComment blogComment;

    @BeforeEach
    void setUp() throws Exception {
        reactionRepository.deleteAll();
        blogCommentRepository.deleteAll();
        blogPostRepository.deleteAll();
        userRepository.deleteAll();

        loggedInUser = userRepository.save(EntityCreationHelper.createClient());
        blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));
        blogComment = blogCommentRepository.save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        session = getSession(loggedInUser.getEmail(), "Password123!");
    }

    @Test
    void testReactToPost() throws Exception {
        ReactionRequestDto requestDto = new ReactionRequestDto();
        requestDto.setReactionType(ReactionTypeConstants.LIKE);
        requestDto.setBlogPostId(blogPost.getId());

        mockMvc.perform(post("/api/blog-posts/reactions/post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto))
                        .session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testReactToComment() throws Exception {
        ReactionRequestDto requestDto = new ReactionRequestDto();
        requestDto.setReactionType(ReactionTypeConstants.LIKE);
        requestDto.setBlogCommentId(blogComment.getId());

        mockMvc.perform(post("/api/blog-posts/reactions/comment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto))
                        .session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testGetReactionsByPost() throws Exception {
        Reaction reaction = reactionRepository.save(
                Reaction.builder()
                        .reactionType(ReactionTypeConstants.LIKE)
                        .blogPost(blogPost)
                        .user(loggedInUser)
                        .build()
        );

        mockMvc.perform(get("/api/blog-posts/reactions/post/" + blogPost.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testGetReactionsByComment() throws Exception {
        Reaction reaction = reactionRepository.save(
                Reaction.builder()
                        .reactionType(ReactionTypeConstants.LIKE)
                        .blogComment(blogComment)
                        .user(loggedInUser)
                        .build()
        );

        mockMvc.perform(get("/api/blog-posts/reactions/comment/" + blogComment.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteReactionByOwner() throws Exception {
        Reaction reaction = reactionRepository.save(
                Reaction.builder()
                        .reactionType(ReactionTypeConstants.LIKE)
                        .blogPost(blogPost)
                        .user(loggedInUser)
                        .build()
        );

        mockMvc.perform(delete("/api/blog-posts/reactions/" + reaction.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        assertThat(reactionRepository.findById(reaction.getId())).isEmpty();
    }

    @Test
    void testDeleteReactionNotOwner() throws Exception {
        User anotherUser = userRepository.save(EntityCreationHelper.createFreelancer(0));
        Reaction reaction = reactionRepository.save(
                Reaction.builder()
                        .reactionType(ReactionTypeConstants.LIKE)
                        .blogPost(blogPost)
                        .user(anotherUser)
                        .build()
        );

        mockMvc.perform(delete("/api/blog-posts/reactions/" + reaction.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
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
