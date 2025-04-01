package com.quolance.quolance_api.services.ai_models.recommendation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.recommendation.FreelancerRecommendationDto;
import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.ai_models.GeminiEmbeddingService;
import com.quolance.quolance_api.util.SimilarityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserRepository userRepository;
    private final GeminiEmbeddingService geminiEmbeddingService;
    private final ObjectMapper objectMapper;

    /**
     * Recommend top N freelancers based on project description similarity.
     */
    @Transactional(readOnly = true)
    public List<FreelancerRecommendationDto> recommendFreelancers(Project project, int topN) {
        String projectText = project.getDescription();
        float[] projectEmbedding = geminiEmbeddingService.embedContent(projectText, "SEMANTIC_SIMILARITY");

        List<User> freelancers = userRepository.findAllByRole(Role.FREELANCER);

        return freelancers.stream()
                .map(user -> {
                    Profile profile = user.getProfile();
                    double similarity = 0.0;
                    if (profile != null && profile.getEmbeddingJson() != null) {
                        try {
                            float[] profileEmbedding = objectMapper.readValue(profile.getEmbeddingJson(), float[].class);
                            similarity = SimilarityUtils.cosineSimilarity(projectEmbedding, profileEmbedding);
                        } catch (IOException e) {
                            similarity = 0.0;
                        }
                    }
                    return Map.entry(user, similarity);
                })
                .sorted(Comparator.comparingDouble((Map.Entry<User, Double> entry) -> entry.getValue()).reversed())
                .limit(topN)
                .map(entry -> FreelancerRecommendationDto.builder()
                        .profile(FreelancerProfileDto.fromEntity(entry.getKey()))
                        .similarityScore(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}