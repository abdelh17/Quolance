package com.quolance.quolance_api.dtos.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectEvaluationResult {
    private UUID projectId;
    private boolean approved = false;
    private double confidenceScore;
    private String reason;
    private List<String> flags;
    private boolean requiresManualReview = true;
}