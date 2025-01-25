package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.BlogPost;
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
    private Set<BlogTagDto> tags;

    public static BlogPost toEntity(BlogPostRequestDto blogPostRequestDto) {
        BlogPost blogPost = BlogPost.builder()
                .title(blogPostRequestDto.getTitle())
                .content(blogPostRequestDto.getContent())
                .build();

        if (blogPostRequestDto.getTags() != null) {
            blogPost.setTags(blogPostRequestDto.getTags().stream()
                    .map(BlogTagDto::getName)
                    .map(tag -> {
                        try {
                            System.out.println("TAG ENCOUNTERED " + tag);
                            return BlogTags.valueOf(tag.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            System.out.println("Invalid tag encountered: " + tag); // Debugging log
                            throw new InvalidBlogTagException("Invalid tag: " + tag);
                        }
                    })
                    .collect(Collectors.toSet()));
        } else {
            blogPost.setTags(new HashSet<>()); // Ensure it's initialized as empty
        }

        return blogPost;
    }
}