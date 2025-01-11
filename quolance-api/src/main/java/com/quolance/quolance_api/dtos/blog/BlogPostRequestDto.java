package com.quolance.quolance_api.dtos.blog;

import java.util.List;

import com.quolance.quolance_api.dtos.BlogCommentDto;

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
    private Long userId; // User ID creating the blog post
     private List<BlogCommentDto> comments;
//     public Object getComments() {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'getComments'");
//     }
}