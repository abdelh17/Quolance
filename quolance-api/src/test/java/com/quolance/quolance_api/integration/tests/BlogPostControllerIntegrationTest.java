package com.quolance.quolance_api.integration.tests;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

import java.time.LocalDateTime;
import java.util.List;

import com.quolance.quolance_api.dtos.blog.BlogFilterRequestDto;
import com.quolance.quolance_api.entities.enums.BlogTags;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.dtos.blog.BlogPostUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.BlogImage;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ActiveProfiles("test")
class BlogPostControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User loggedInUser;

    @BeforeEach
    void setUp() throws Exception {
        blogPostRepository.deleteAll();
        userRepository.deleteAll();
        loggedInUser = userRepository.save(EntityCreationHelper.createClient());
        session = sessionCreationHelper.getSession(loggedInUser.getEmail(), "Password123!");
        EntityCreationHelper.createFullBlogPost(loggedInUser,"java", "freelancing", List.of(BlogTags.SUPPORT, BlogTags.FREELANCING), LocalDateTime.of(2024, 2, 1, 0, 0));
    }

    @Test
    void testCreateBlogPostWithImages() throws Exception {
        MockMultipartFile image1 = new MockMultipartFile("images", "test-image1.jpg", "image/jpeg", "Image 1 Content".getBytes());
        MockMultipartFile image2 = new MockMultipartFile("images", "test-image2.jpg", "image/jpeg", "Image 2 Content".getBytes());

        mockMvc.perform(multipart("/api/blog-posts")
                        .file(image1)
                        .file(image2)
                        .param("title", "Integration Test Post")
                        .param("content", "This is a blog post with images.")
                        .session(session)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Integration Test Post"))
                .andExpect(jsonPath("$.imageUrls").isArray())
                .andExpect(jsonPath("$.imageUrls", org.hamcrest.Matchers.hasSize(2))); // Verify image count in response

        // Verify the blog post was saved with BlogImage entities
        BlogPost savedPost = blogPostRepository.findAll().getFirst();
        assertThat(savedPost.getImages()).hasSize(2);

        // Verify the image paths inside the BlogImage entities
        List<BlogImage> savedImages = savedPost.getImages();
        assertThat(savedImages.get(0).getImagePath()).isNotBlank();
        assertThat(savedImages.get(1).getImagePath()).isNotBlank();
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
    void testGetBlogPostByIdIsOk() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPostWithImages(loggedInUser));

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
        UUID notFound = UUID.randomUUID();
        var response = mockMvc.perform(get("/api/blog-posts/"+notFound)
                .session(session)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);

        String errorMessage = jsonNode.get("message").asText();

        assertThat(errorMessage).isEqualTo("No blog post found with ID: "+ notFound);
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

        BlogPost updatedPost = blogPostRepository.findById(blogPost.getId()).orElseThrow();
        assertThat(updatedPost.getTitle()).isEqualTo("Updated Title");
        assertThat(updatedPost.getContent()).isEqualTo("Updated Content");
    }

    @Test
    void testDeleteBlogPostWithImages() throws Exception {
        BlogPost blogPost = blogPostRepository.save(EntityCreationHelper.createBlogPostWithImages(loggedInUser));

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
        assertThat(userPosts.get(0).getUserId()).isEqualTo(loggedInUser.getId());
    }

    @Test
    void testDeleteBlogPostWithoutImages() throws Exception {
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

    @Test
    void testFilterBlogPostsByTitle() throws Exception {
        BlogFilterRequestDto filterRequest = new BlogFilterRequestDto();
        filterRequest.setTitle("java");
        performFilterRequest(filterRequest).andExpect(status().isOk());
    }

    @Test
    void testFilterBlogPostsByContent() throws Exception {
        BlogFilterRequestDto filterRequest = new BlogFilterRequestDto();
        filterRequest.setContent("freelancing");
        performFilterRequest(filterRequest).andExpect(status().isOk());
    }

    @Test
    void testFilterBlogPostsByTags() throws Exception {
        BlogFilterRequestDto filterRequest = new BlogFilterRequestDto();
        filterRequest.setTags(Set.of(BlogTags.SUPPORT, BlogTags.FREELANCING));
        performFilterRequest(filterRequest).andExpect(status().isOk());
    }

    @Test
    void testFilterBlogPostsByCreationDate() throws Exception {
        BlogFilterRequestDto filterRequest = new BlogFilterRequestDto();
        filterRequest.setCreationDate(LocalDateTime.of(2024, 2, 1, 0, 0));
        performFilterRequest(filterRequest).andExpect(status().isOk());
    }

    @Test
    void testFilterBlogPostsByAllFields() throws Exception {
        BlogFilterRequestDto filterRequest = new BlogFilterRequestDto();
        filterRequest.setTitle("java");
        filterRequest.setContent("freelancing");
        filterRequest.setCreationDate(LocalDateTime.of(2024, 2, 1, 0, 0));
        filterRequest.setTags(Set.of(BlogTags.SUPPORT, BlogTags.FREELANCING));
        performFilterRequest(filterRequest).andExpect(status().isOk());
    }

    private ResultActions performFilterRequest(BlogFilterRequestDto filterRequest) throws Exception {
        return mockMvc.perform(get("/api/blog-posts/filter").session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(filterRequest)));
    }
}
