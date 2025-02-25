package com.quolance.quolance_api.dtos.blog;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BlogFilterRequestDto {
    private String title;
    private String content;
    private String tag;
    private LocalDateTime creationDate;
    private String timeRange; // "TODAY", "LAST_WEEK", "LAST_MONTH"
    private Boolean sortByNewest;
}
