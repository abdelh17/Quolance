package com.quolance.quolance_api.integration.tests;

import com.quolance.quolance_api.dtos.blog.BlogCommentDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.blog.BlogCommentRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
class BlogCommentControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogCommentRepository blogCommentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private User loggedInUser;
    private BlogPost blogPost;

    @BeforeEach
    void setUp() throws Exception {
        projectRepository.deleteAll();
        blogCommentRepository.deleteAll();
        blogPostRepository.deleteAll();
        userRepository.deleteAll();

        loggedInUser = userRepository.save(EntityCreationHelper.createClient());
        blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        session = sessionCreationHelper.getSession("client@test.com", "Password123!");
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
        BlogComment blogComment = blogCommentRepository
                .save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        BlogCommentDto blogCommentDto = new BlogCommentDto();
        blogCommentDto.setContent("Updated Comment Content");
        blogCommentDto.setBlogPostId(blogPost.getId());
        blogCommentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(put("/api/blog-comments/" + blogComment.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(blogCommentDto)))
                .andExpect(status().isOk());

        BlogComment updatedComment = blogCommentRepository.findAll().getFirst();
        assertThat(updatedComment.getContent()).isEqualTo("Updated Comment Content");
    }
}
