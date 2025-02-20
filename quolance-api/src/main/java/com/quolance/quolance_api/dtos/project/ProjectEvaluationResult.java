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
public class ProjectEvaluationResult {
    private boolean approved = false;
    private double confidenceScore;
    private String reason;
    private List<String> flags;
    private boolean requiresManualReview = true;
}