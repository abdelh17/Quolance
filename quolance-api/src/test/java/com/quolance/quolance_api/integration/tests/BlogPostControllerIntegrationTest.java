package com.quolance.quolance_api.integration.tests;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
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
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;

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

        var response = mockMvc.perform(post("/api/blog-posts")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity())
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertThat(response).contains("title"); // Ensure error message mentions missing 'title'
    }

    @Test
    void testGetAllBlogPosts() throws Exception {
        blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        var response = mockMvc.perform(get("/api/blog-posts/all")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var blogPosts = objectMapper.readValue(response, new TypeReference<List<BlogPostResponseDto>>() {
        });

        assertThat(blogPosts).isNotEmpty();
        assertThat(blogPosts).hasSize(1);
        assertThat(blogPosts.get(0).getUser_id()).isEqualTo(loggedInUser.getId());
    }

    @Test
    void testGetBlogPostByIdIsOk() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));

        var response = mockMvc.perform(get("/api/blog-posts/" + blogPost.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var blogPostResponse = objectMapper.readValue(response, BlogPostResponseDto.class);

        assertThat(blogPostResponse).isNotNull();
        assertThat(blogPostResponse.getId()).isEqualTo(blogPost.getId());
        assertThat(blogPostResponse.getTitle()).isEqualTo(blogPost.getTitle());
    }

    @Test
    void testGetBlogPostByIdNotFound() throws Exception {
        var response = mockMvc.perform(get("/api/blog-posts/999")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);

        String errorMessage = jsonNode.get("message").asText();

        assertThat(errorMessage).isEqualTo("No blog post found with ID: 999");
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

        var response = mockMvc.perform(get("/api/blog-posts/user/" + loggedInUser.getId())
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        var userPosts = objectMapper.readValue(response, new TypeReference<List<BlogPostResponseDto>>() {
        });

        assertThat(userPosts).isNotEmpty();
        assertThat(userPosts.get(0).getUser_id()).isEqualTo(loggedInUser.getId());
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

        for (int i = 0; i < 15; i++) {
            blogPostRepository.save(EntityCreationHelper.createBlogPost(loggedInUser));
        }

        var response = mockMvc.perform(get("/api/blog-posts?page=0&size=10")
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);

        List<BlogPostResponseDto> content = objectMapper.readValue(
                jsonNode.get("content").toString(), new TypeReference<>() {
                });
        long totalElements = jsonNode.get("totalElements").asLong();
        int totalPages = jsonNode.get("totalPages").asInt();
        Pageable pageable = PageRequest.of(0, 10);

        PageImpl<BlogPostResponseDto> pageResponse = new PageImpl<>(content, pageable, totalElements);

        assertThat(pageResponse).isNotNull();
        assertThat(pageResponse.getContent()).hasSize(10);
        assertThat(pageResponse.getTotalElements()).isEqualTo(15);
        assertThat(pageResponse.getTotalPages()).isEqualTo(2);
    }

}
