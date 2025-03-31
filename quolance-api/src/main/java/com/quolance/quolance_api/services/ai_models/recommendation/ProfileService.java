package com.quolance.quolance_api.services.ai_models.recommendation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.services.ai_models.GeminiEmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final GeminiEmbeddingService geminiEmbeddingService;
    private final ObjectMapper objectMapper;
    // Assume you have a ProfileRepository injected to save changes
    // private final ProfileRepository profileRepository;

    @Transactional
    public void updateProfileEmbedding(Profile profile) {
        // Concatenate profile information (for example, bio and skills)
        StringBuilder textForEmbedding = new StringBuilder();
        if (profile.getBio() != null) {
            textForEmbedding.append(profile.getBio());
        }
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            textForEmbedding.append(" Skills: ").append(profile.getSkills().toString());
        }
        // Optionally add work experiences or certifications

        float[] embedding = geminiEmbeddingService.embedContent(textForEmbedding.toString(), "SEMANTIC_SIMILARITY");

        try {
            String embeddingJson = objectMapper.writeValueAsString(embedding);
            profile.setEmbeddingJson(embeddingJson);
            // Save the profile via repository if necessary
            // profileRepository.save(profile);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize embedding", e);
        }
    }
}
