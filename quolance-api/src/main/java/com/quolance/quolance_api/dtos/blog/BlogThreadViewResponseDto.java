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
public class BlogThreadViewResponseDto {
    private Long id;
    private String title;
    private Long blogPostId; // ID of the associated BlogPost
    private LocalDateTime dateCreated; // Matches BlogPost's date
}