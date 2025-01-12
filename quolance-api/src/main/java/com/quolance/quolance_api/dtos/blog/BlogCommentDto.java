package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.BlogComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogCommentDto {

    private Long commentId;
    private Long blogPostId;
    private Long userId;
    private String content;


    public static BlogCommentDto fromEntity(BlogComment blogComment) {
        return BlogCommentDto.builder()
                .commentId(blogComment.getId())
                .blogPostId(blogComment.getBlogPost().getId())
                .userId(blogComment.getUser().getId())
                .content(blogComment.getContent())
                .build();
    }

    public static BlogComment toEntity(BlogCommentDto blogPost) {
        return BlogComment.builder()
                .content(blogPost.getContent())
                .build();
    }
}