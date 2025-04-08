package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.enums.BlogTags;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostUpdateDto {
    private UUID postId;
    private String title;
    private String content;
    private Set<BlogTags> tags;
}