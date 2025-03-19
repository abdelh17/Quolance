package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.blog.BlogImage;
import com.quolance.quolance_api.entities.blog.BlogPost;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostResponseDto {
    private UUID id;
    private String title;
    private String content;
    private String authorName;
    private LocalDateTime dateCreated;
    private List<BlogCommentDto> comments;
    private Set<String> tags;
    private UUID userId;
    private List<String> imageUrls;
    private boolean isReported;
    private boolean isResolved;

    public static BlogPostResponseDto fromEntity(BlogPost blogPost) {
        BlogPostResponseDto response = new BlogPostResponseDto();
        response.setUserId(blogPost.getUser().getId());
        response.setId(blogPost.getId());
        response.setTitle(blogPost.getTitle());
        response.setContent(blogPost.getContent());
        response.setAuthorName(blogPost.getUser().getUsername());
        response.setDateCreated(blogPost.getCreationDate());
        response.setTags(blogPost.getTags() != null
                ? blogPost.getTags().stream()
                .map(Enum::name)
                .collect(Collectors.toSet())
                : Collections.emptySet());
        // Map BlogImage entities to URLs
        List<String> imageUrls = blogPost.getImages().stream()
                .map(BlogImage::getImagePath)
                .toList();
        response.setImageUrls(imageUrls);
        response.setReported(blogPost.isReported());
        response.setResolved(blogPost.isResolved());
        return response;
    }

}