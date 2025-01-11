package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.BlogComment;
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
    private LocalDateTime createdAt;

    public BlogComment toEntity() {
        return BlogComment.builder()
                .id(this.id)
                .content(this.content)
                .createdAt(this.createdAt != null ? 
                           Date.valueOf(this.createdAt.toLocalDate()) : 
                           new Date(System.currentTimeMillis()))
                .build();
    }
    public static BlogCommentDto fromEntity(BlogComment blogComment) {
        if (blogComment == null) {
            return null;
        }
        return BlogCommentDto.builder()
                .id(blogComment.getId())
                .blogPostId(blogComment.getBlogPost() != null ? blogComment.getBlogPost().getId() : null)
                .userId(blogComment.getUser() != null ? blogComment.getUser().getId() : null)
                .content(blogComment.getContent())
                .createdAt(blogComment.getCreatedAt() != null ? 
                           blogComment.getCreatedAt().toLocalDate().atStartOfDay() : 
                           null)
                .build();
    }
}