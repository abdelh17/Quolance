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
public class ProfileEmbeddingService {

    private final GeminiEmbeddingService geminiEmbeddingService;
    private final ObjectMapper objectMapper;

    @Transactional
    public void updateProfileEmbedding(Profile profile) {
        StringBuilder textForEmbedding = new StringBuilder();

        // Append bio if present
        if (profile.getBio() != null) {
            textForEmbedding.append(profile.getBio());
        }

        // Append skills if present
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            textForEmbedding.append(" Skills: ").append(profile.getSkills().toString());
        }

        // Append work experiences if available
        if (profile.getWorkExperiences() != null && !profile.getWorkExperiences().isEmpty()) {
            textForEmbedding.append(" Work Experiences: ");
            profile.getWorkExperiences().forEach(exp -> textForEmbedding.append(exp.toString()).append(" "));
        }

        // Append certifications if available
        if (profile.getCertifications() != null && !profile.getCertifications().isEmpty()) {
            textForEmbedding.append(" Certifications: ").append(profile.getCertifications().toString());
        }

        // Append languages spoken if available
        if (profile.getLanguagesSpoken() != null && !profile.getLanguagesSpoken().isEmpty()) {
            textForEmbedding.append(" Languages: ").append(profile.getLanguagesSpoken().toString());
        }

        // Append project experiences if available
        if (profile.getProjectExperiences() != null && !profile.getProjectExperiences().isEmpty()) {
            textForEmbedding.append(" Project Experiences: ");
            profile.getProjectExperiences().forEach(exp -> textForEmbedding.append(exp.toString()).append(" "));
        }

        // Now generate the embedding for the concatenated text
        float[] embedding = geminiEmbeddingService.embedContent(textForEmbedding.toString(), "SEMANTIC_SIMILARITY");

        try {
            String embeddingJson = objectMapper.writeValueAsString(embedding);
            profile.setEmbeddingJson(embeddingJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize embedding", e);
        }
    }
}
