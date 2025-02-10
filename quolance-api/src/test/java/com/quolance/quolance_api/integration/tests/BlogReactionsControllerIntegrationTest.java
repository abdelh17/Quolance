package com.quolance.quolance_api.integration.tests;

import com.quolance.quolance_api.dtos.blog.ReactionRequestDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.ReactionType;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.blog.BlogCommentRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import com.quolance.quolance_api.repositories.blog.ReactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
class BlogReactionsControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogCommentRepository blogCommentRepository;

    @Autowired
    private UserRepository userRepository;

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

        session = sessionCreationHelper.getSession("client@test.com", "Password123!");

    }

    @Test
    void testReactToPost() throws Exception {
        ReactionRequestDto requestDto = new ReactionRequestDto();
        requestDto.setReactionType(ReactionType.LIKE);
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
        requestDto.setReactionType(ReactionType.LIKE);
        requestDto.setBlogCommentId(blogComment.getId());

        mockMvc.perform(post("/api/blog-posts/reactions/comment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto))
                        .session(session))
                .andExpect(status().isOk());
    }

    @Test
    void testGetReactionsByPost() throws Exception {
        reactionRepository.save(
                Reaction.builder()
                        .reactionType(ReactionType.LIKE)
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
        reactionRepository.save(
                Reaction.builder()
                        .reactionType(ReactionType.LIKE)
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
                        .reactionType(ReactionType.LIKE)
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
                        .reactionType(ReactionType.LIKE)
                        .blogPost(blogPost)
                        .user(anotherUser)
                        .build()
        );

        mockMvc.perform(delete("/api/blog-posts/reactions/" + reaction.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
