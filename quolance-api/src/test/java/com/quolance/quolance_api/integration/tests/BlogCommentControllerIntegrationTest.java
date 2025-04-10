package com.quolance.quolance_api.integration.tests;

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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatList;
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
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        long updatedCount = blogCommentRepository.count();
        assertThat(updatedCount).isEqualTo(1);

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
                .andExpect(status().isUnprocessableEntity());
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
        boolean isLastPage = jsonNode.get("last").asBoolean();
        Pageable pageable = PageRequest.of(0, 3);

        PageImpl<BlogCommentDto> pageResponse = new PageImpl<>(content, pageable, totalElements);

        assertThat(pageResponse).isNotNull();
        assertThatList(pageResponse.getContent()).isNotNull().hasSize(3);
        assertThat(pageResponse.getTotalElements()).isEqualTo(6);
        assertThat(pageResponse.getTotalPages()).isEqualTo(2);
        assertThat(isLastPage).isFalse();
    }

    @Test
    void testCreateBlogComment_Unauthenticated_ShouldReturn401() throws Exception {
        BlogCommentDto commentDto = new BlogCommentDto();
        commentDto.setContent("Should fail");
        commentDto.setBlogPostId(blogPost.getId());
        commentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(post("/api/blog-comments/" + blogPost.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentDto))) 
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testUpdateBlogComment_AsDifferentUser_ShouldReturn403() throws Exception {
        User otherUser = EntityCreationHelper.createClient();
        otherUser.setEmail("other_" + UUID.randomUUID() + "@test.com");
        otherUser.setUsername("User_" + UUID.randomUUID());
        otherUser = userRepository.save(otherUser);

        BlogComment blogComment = blogCommentRepository.save(
                EntityCreationHelper.createBlogComment(otherUser, blogPost));

        BlogCommentDto commentDto = new BlogCommentDto();
        commentDto.setContent("Unauthorized edit");
        commentDto.setBlogPostId(blogPost.getId());
        commentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(put("/api/blog-comments/" + blogComment.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testDeleteBlogComment_AsDifferentUser_ShouldReturn403() throws Exception {
        User otherUser = EntityCreationHelper.createClient();
        otherUser.setEmail("other_" + UUID.randomUUID() + "@test.com");
        otherUser.setUsername("User_" + UUID.randomUUID());
        otherUser = userRepository.save(otherUser);

        BlogComment blogComment = blogCommentRepository.save(
                EntityCreationHelper.createBlogComment(otherUser, blogPost));

        mockMvc.perform(delete("/api/blog-comments/" + blogComment.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden()); 
    }

    @Test
    void testUpdateBlogComment_WithInvalidContent_ShouldReturn422() throws Exception {
        BlogComment blogComment = blogCommentRepository.save(
                EntityCreationHelper.createBlogComment(loggedInUser, blogPost));

        BlogCommentDto commentDto = new BlogCommentDto();
        commentDto.setContent(""); // invalid
        commentDto.setBlogPostId(blogPost.getId());
        commentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(put("/api/blog-comments/" + blogComment.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentDto)))
                .andExpect(status().isUnprocessableEntity()); 
    }

    @Test
    void testCreateBlogComment_OnNonexistentPost_ShouldReturn404() throws Exception {
        UUID invalidPostId = UUID.randomUUID(); // doesn't exist

        BlogCommentDto commentDto = new BlogCommentDto();
        commentDto.setContent("Comment on non-existent post");
        commentDto.setBlogPostId(invalidPostId);
        commentDto.setUserId(loggedInUser.getId());

        mockMvc.perform(post("/api/blog-comments/" + invalidPostId)
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentDto)))
                .andExpect(status().isNotFound()); 
    }

    @Test
    void testGetCommentsPageBeyondRange_ShouldReturnEmptyContent() throws Exception {
        for (int i = 0; i < 2; i++) {
            blogCommentRepository.save(EntityCreationHelper.createBlogComment(loggedInUser, blogPost));
        }

        var response = mockMvc.perform(get("/api/blog-comments/" + blogPost.getId() + "?page=5&size=2")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode content = jsonNode.get("content");

        assertThat(content).isNotNull();
        assertThat(content.isEmpty()).isTrue();
    }

}
