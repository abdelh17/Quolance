package com.quolance.quolance_api.dtos.blog;

import com.quolance.quolance_api.entities.enums.BlogTags;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class BlogFilterRequestDto {
    private String title;
    private String content;
    private Set<BlogTags> tags;
    private LocalDateTime creationDate;
    private String timeRange; // "TODAY", "LAST_WEEK", "LAST_MONTH"
    private Boolean sortByNewest;

    @Override
    public String toString() {
        return "BlogFilterRequestDto{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", creationDate=" + creationDate +
                ", timeRange='" + timeRange + '\'' +
                ", sortByNewest=" + sortByNewest +
                ", tags=" + tags +
                '}';
    }
}
