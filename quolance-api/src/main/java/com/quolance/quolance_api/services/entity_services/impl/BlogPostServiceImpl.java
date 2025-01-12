package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.blog.BlogPostRequestDto;
import com.quolance.quolance_api.dtos.blog.BlogPostResponseDto;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.BlogPostRepository;
import com.quolance.quolance_api.services.entity_services.BlogPostService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;

    @Override
    public BlogPostResponseDto create(@Valid BlogPostRequestDto request, User author) {
        BlogPost blogPost = BlogPostRequestDto.toEntity(request);
        blogPost.setUser(author);
        BlogPost savedBlogPost = blogPostRepository.save(blogPost);

        return BlogPostResponseDto.fromEntity(savedBlogPost);
    }

    @Override
    public List<BlogPostResponseDto> getAll() {
        List<BlogPost> blogPosts = blogPostRepository.findAll();
        return blogPosts.stream()
                .map(BlogPostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public List<BlogPostResponseDto> getBlogPostsByUserId(Long userId) {
        List<BlogPost> blogPosts = blogPostRepository.findByUserId(userId);
        return blogPosts.stream()
                .map(BlogPostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public BlogPostResponseDto update(BlogPostUpdateDto request, User author) {
        BlogPost blogPost = getBlogPostEntity(request.getPostId());
        if (!isAuthorOfPost(blogPost, author)) {
            throw new ApiException("You cannot edit a project that does not belong to you.");
        }
        BlogPost updated = updateBlogPost(request, blogPost);
        blogPostRepository.save(updated);
        return BlogPostResponseDto.fromEntity(updated);
    }

    @Override
    public void deletePost(Long id, User author) {
        BlogPost blogPost = getBlogPostEntity(id);

        if (!isAuthorOfPost(blogPost, author)) {
            throw new ApiException("You cannot delete a project that does not belong to you.");
        }
        blogPostRepository.deleteById(id);
    }

    @Override
    public BlogPostResponseDto getBlogPost(Long id) {
        return BlogPostResponseDto.fromEntity(getBlogPostEntity(id));
    public BlogPostResponseDto mapToResponseDto(BlogPost blogPost) {
        List<BlogCommentDto> commentDtos = blogPost.getBlogComments().stream()
                .map(BlogCommentDto::fromEntity)
                .collect(Collectors.toList());

        return new BlogPostResponseDto(
                blogPost.getId(),
                blogPost.getTitle(),
                blogPost.getContent(),
                blogPost.getUser().getFirstName() + " " + blogPost.getUser().getLastName(),
                blogPost.getCreationDate(),
                commentDtos);
        // blogPost.getTags().stream().map(Tag::getName).collect(Collectors.toList()),
        // // Empty if no tags
        // new ArrayList<>(), // Placeholder for reactions
        // new ArrayList<>() // Placeholder for replies
    }

    private BlogPost updateBlogPost(BlogPostUpdateDto updateRequest, BlogPost blogPost) {
        if (updateRequest.getContent() != null)
            blogPost.setContent(updateRequest.getContent());
        if (updateRequest.getTitle() != null)
            blogPost.setTitle(updateRequest.getTitle());
        return blogPost;
    }

    private boolean isAuthorOfPost(BlogPost blogPost, User author) {
        return blogPost.getUser().getId().equals(author.getId());
    }

    private BlogPost getBlogPostEntity(Long postId) {
        return blogPostRepository.findById(postId).orElseThrow(() ->
                ApiException.builder()
                        .status(HttpServletResponse.SC_NOT_FOUND)
                        .message("No blog post found with ID: " + postId)
                        .build());
    }


}