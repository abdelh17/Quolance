package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.BlogThreadView;
import com.quolance.quolance_api.entities.Tag;
import lombok.*;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogThreadViewDto {

    private long id;
    private long blogPostId;
    private Set<Long> tagIds;

    // Convert BlogThreadViewDto to BlogThreadView entity
    public BlogThreadView toEntity(Set<Tag> tags) {
        BlogThreadView blogThreadView = new BlogThreadView();
        blogThreadView.setId(this.id);
        blogThreadView.setTags(tags);
        return blogThreadView;
    }

    // Convert BlogThreadView entity to BlogThreadViewDto
    public static BlogThreadViewDto fromEntity(BlogThreadView blogThreadView) {
        return BlogThreadViewDto.builder()
                .id(blogThreadView.getId())
                // .blogPostId(blogThreadView.getBlogPost().getId())
               // .tagIds(blogThreadView.getTags().stream().map(Tag::getId).collect(Collectors.toSet()))
                .build();
    }
}
