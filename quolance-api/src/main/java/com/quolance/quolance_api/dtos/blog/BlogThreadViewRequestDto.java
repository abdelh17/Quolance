package com.quolance.quolance_api.dtos.blog;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogThreadViewRequestDto {
    private String title;
    private Long blogPostId; // ID of the associated BlogPost
    private String content;
    private long userId;
}
