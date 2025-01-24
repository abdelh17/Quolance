package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.BlogReactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
    private List<BlogCommentDto> comments;
    // Map of reaction types and their counts
    private Map<BlogReactionType, Long> reactionCounts;

    public static BlogPostResponseDto fromEntity(BlogPost blogPost) {
        BlogPostResponseDto response = new BlogPostResponseDto();
        response.setId(blogPost.getId());
        response.setTitle(blogPost.getTitle());
        response.setContent(blogPost.getContent());
        response.setAuthorName(blogPost.getUser().getUsername());
        response.setDateCreated(blogPost.getCreationDate());
        response.setReactionCounts(blogPost.getReactionCounts()); // Include reaction counts
        return response;
    }

}