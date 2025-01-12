package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.BlogPost;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostRequestDto {
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Title is required")
    private String content;


    public static BlogPost toEntity(BlogPostRequestDto blogPostRequestDto) {
        return BlogPost.builder()
                .title(blogPostRequestDto.getTitle())
                .content(blogPostRequestDto.getContent())
                .build();
    }
}