package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.sql.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogCommentDto {

    private Long id;
    private Long blogPostId;
    private Long userId;
    private String content;

   public BlogComment toEntity(BlogPost blogPost, User user) {
    return BlogComment.builder()
            .content(this.content)
            .blogPost(blogPost) // Set the BlogPost entity
            .user(user)         // Set the User entity
            .build();
}

    public static BlogCommentDto fromEntity(BlogComment blogComment) {
        if (blogComment == null) {
            return null;
        }
        return BlogCommentDto.builder()
                .id(blogComment.getId()) // Set the ID here
                .blogPostId(blogComment.getBlogPost() != null ? blogComment.getBlogPost().getId() : null)
                .userId(blogComment.getUser() != null ? blogComment.getUser().getId() : null)
                .content(blogComment.getContent())
                .build();
    }
}