package com.quolance.quolance_api.integration.tests;

import static org.assertj.core.api.Assertions.assertThatList;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
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
        long initialCount = blogCommentRepository.count();

        BlogCommentDto commentDto = new BlogCommentDto();
        commentDto.setContent("This is a valid comment");
        commentDto.setBlogPostId(blogPost.getId());
        commentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(post("/api/blog-comments/" + blogPost.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentDto))
                .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        long updatedCount = blogCommentRepository.count();
        assertThat(updatedCount).isEqualTo(initialCount + 1);

        BlogComment savedComment = blogCommentRepository.findAll().getFirst();
        assertThat(savedComment.getContent()).isEqualTo("This is a valid comment");
        assertThat(savedComment.getBlogPost().getId()).isEqualTo(blogPost.getId());
        assertThat(savedComment.getUser().getId()).isEqualTo(loggedInUser.getId());
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
        for (int i = 0; i < 5; i++) {
            blogCommentRepository.save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));
        }

        var response = mockMvc.perform(get("/api/blog-comments/post/" + blogPost.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<BlogCommentDto> comments = objectMapper.readValue(response, new TypeReference<List<BlogCommentDto>>() {
        });

        assertThat(comments).isNotNull();
        assertThatList(comments).isNotEmpty();
        assertThat(comments.size()).isEqualTo(5);

        assertThatList(comments).allSatisfy(comment -> {
            assertThat(comment.getBlogPostId()).isEqualTo(blogPost.getId());
            assertThat(comment.getUserId()).isEqualTo(loggedInUser.getId());
            assertThat(comment.getContent()).isNotBlank();
        });
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

    @Test
    void testGetPaginatedBlogComments() throws Exception {

        for (int i = 0; i < 6; i++) {
            blogCommentRepository.save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));
        }

        var response = mockMvc.perform(get("/api/blog-comments/" + blogPost.getId() + "?page=0&size=3")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);

        JsonNode contentNode = jsonNode.get("content");
        assertThat(contentNode).isNotNull();

        List<BlogCommentDto> content = objectMapper.readValue(
                contentNode.toString(), new TypeReference<List<BlogCommentDto>>() {
                });

        long totalElements = jsonNode.get("totalElements").asLong();
        int totalPages = jsonNode.get("totalPages").asInt();
        boolean isLastPage = jsonNode.get("last").asBoolean();
        Pageable pageable = PageRequest.of(0, 3);

        PageImpl<BlogCommentDto> pageResponse = new PageImpl<>(content, pageable, totalElements);

        assertThat(pageResponse).isNotNull();
        assertThatList(pageResponse.getContent()).isNotNull().hasSize(3);
        assertThat(pageResponse.getTotalElements()).isEqualTo(6);
        assertThat(pageResponse.getTotalPages()).isEqualTo(2);
        assertThat(isLastPage).isFalse();
    }

}
