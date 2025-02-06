package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.blog.BlogImage;
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
    private List<String> imageUrls;

    public static BlogPost toEntity(BlogPostRequestDto blogPostRequestDto) {
        BlogPost blogPost = BlogPost.builder()
                .title(blogPostRequestDto.getTitle())
                .content(blogPostRequestDto.getContent())
                .build();

        // Handle images while converting the DTO to an entity
        if (blogPostRequestDto.getImageUrls() != null && !blogPostRequestDto.getImageUrls().isEmpty()) {
            List<BlogImage> images = blogPostRequestDto.getImageUrls().stream()
                    .map(url -> BlogImage.builder()
                            .imageUrl(url)
                            .blogPost(blogPost)
                            .build())
                    .collect(Collectors.toList());
            blogPost.setImages(images);  // Associate images with the blog post
        }

        return blogPost;
    }
}