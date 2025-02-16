package com.quolance.quolance_api.dtos.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCreateResponseDto {
    private boolean approved;
    private double confidenceScore;
    private String reason;
    private List<String> flags;
    private boolean requiresManualReview;
}