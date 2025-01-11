package com.quolance.quolance_api.dtos.blog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

import com.quolance.quolance_api.dtos.BlogCommentDto;
import com.quolance.quolance_api.entities.BlogComment;

@Getter
@Setter
@NoArgsConstructor
// @AllArgsConstructor
public class BlogPostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String authorName; // Derived from User entity
    private LocalDateTime dateCreated;
    private List<BlogCommentDto> comments; // Placeholder for comments

    public BlogPostResponseDto(Long id, String title, String content, String authorName, LocalDateTime dateCreated, List<BlogCommentDto> commentDtos) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorName = authorName;
        this.dateCreated = dateCreated;
        this.comments = commentDtos;
    }



//    private List<ReplyDto> replies; // Placeholder for replies
}