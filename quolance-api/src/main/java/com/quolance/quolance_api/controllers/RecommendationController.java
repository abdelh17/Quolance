package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.recommendation.FreelancerRecommendationDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.services.ai_models.recommendation.RecommendationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final ProjectService projectService;

    @GetMapping("/{projectId}")
    public ResponseEntity<List<FreelancerRecommendationDto>> getFreelancerRecommendations(@PathVariable UUID projectId,
                                                                                   @RequestParam(defaultValue = "5") int topN) {
        Project project = projectService.getProjectById(projectId);
        List<FreelancerRecommendationDto> recommendations = recommendationService.recommendFreelancers(project, topN);
        return ResponseEntity.ok(recommendations);
    }
}
