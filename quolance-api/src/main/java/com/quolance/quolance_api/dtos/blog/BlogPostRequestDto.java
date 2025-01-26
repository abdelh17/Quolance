package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.BlogTags;
import com.quolance.quolance_api.util.exceptions.InvalidBlogTagException;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequestDto {
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Title is required")
    private String content;
    private List<BlogCommentDto> comments;
    private Set<BlogTags> tags;

    public static BlogPost toEntity(BlogPostRequestDto blogPostRequestDto) {
        BlogPost blogPost = BlogPost.builder()
                .title(blogPostRequestDto.getTitle())
                .content(blogPostRequestDto.getContent())
                .build();

        // Map tag strings to BlogTags, validate them, and collect into a set
        if (blogPostRequestDto.getTags() != null) {
            Set<BlogTags> validTags = blogPostRequestDto.getTags().stream()
                    .map(tag -> {
                        try {
                            return tag; // Convert string to BlogTags enum
                        } catch (IllegalArgumentException e) {
                            throw new InvalidBlogTagException("Invalid tag: " + tag); // Handle invalid tag
                        }
                    })
                    .collect(Collectors.toSet());

            blogPost.setTags(validTags); // Set valid tags
        } else {
            blogPost.setTags(new HashSet<>()); // Ensure it's initialized as empty
        }

        return blogPost;
    }
}