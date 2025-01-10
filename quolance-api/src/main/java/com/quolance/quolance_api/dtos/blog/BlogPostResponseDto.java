package com.quolance.quolance_api.dtos.blog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostResponseDto {
    private Long id;
    private String title;
    private String content;
    private String authorName; // Derived from User entity
    private LocalDateTime dateCreated;
//    private List<ReactionDto> reactions; // Placeholder for reactions
//    private List<ReplyDto> replies; // Placeholder for replies
}