package com.quolance.quolance_api.dtos.blog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostUpdateDto {
    private Long postId;
    private String title;
    private String content;
}
