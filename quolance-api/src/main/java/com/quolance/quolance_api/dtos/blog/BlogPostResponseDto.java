package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.BlogPost;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private LocalDateTime dateCreated;

    public static BlogPostResponseDto fromEntity(BlogPost blogPost) {
        BlogPostResponseDto response = new BlogPostResponseDto();
        response.setId(blogPost.getId());
        response.setTitle(blogPost.getTitle());
        response.setContent(blogPost.getContent());
        response.setAuthorName(blogPost.getUser().getUsername());
        response.setDateCreated(blogPost.getCreationDate());
        return response;
    }

    private List<BlogCommentDto> comments;

}