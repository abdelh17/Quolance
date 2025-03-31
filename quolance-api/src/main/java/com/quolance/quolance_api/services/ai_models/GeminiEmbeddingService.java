package com.quolance.quolance_api.services.ai_models;

import com.quolance.quolance_api.configs.GeminiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiEmbeddingService {

    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;

    /**
     * Generates embeddings using the Gemini embedding API.
     * @param text the input text to embed
     * @param taskType e.g., "SEMANTIC_SIMILARITY"
     * @return an array of floats representing the embedding
     */
    public float[] embedContent(String text, String taskType) {
        try {
            Map<String, Object> requestPayload = buildEmbeddingRequest(text, taskType);
            String endpoint = String.format("%s?key=%s",
                    geminiConfig.getEmbeddingBaseUrl(),
                    geminiConfig.getKey());

            log.debug("Sending request to Gemini embedding API at {} with payload: {}", endpoint, requestPayload);

            Map<String, Object> response = geminiWebClient.post()
                    .uri(endpoint)
                    .bodyValue(requestPayload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            log.debug("Received response from Gemini embedding API: {}", response);

            // First, try to extract from "embedding" key
            Object embeddingObject = response.get("embedding");
            List<Double> embeddingValues = null;
            if (embeddingObject instanceof Map) {
                // Expected structure: {"embedding": {"values": [ ... ] } }
                Map<String, Object> embeddingMap = (Map<String, Object>) embeddingObject;
                Object valuesObj = embeddingMap.get("values");
                if (valuesObj instanceof List) {
                    embeddingValues = (List<Double>) valuesObj;
                }
            } else if (embeddingObject instanceof List) {
                // If "embedding" is directly a list, use that.
                embeddingValues = (List<Double>) embeddingObject;
            }

            if (embeddingValues == null) {
                throw new RuntimeException("Unexpected response format from Gemini embedding API: " + response);
            }

            float[] embedding = new float[embeddingValues.size()];
            for (int i = 0; i < embeddingValues.size(); i++) {
                embedding[i] = embeddingValues.get(i).floatValue();
            }
            return embedding;

        } catch (WebClientResponseException e) {
            log.error("Error calling Gemini embedding API: {} - Response body: {}",
                    e.getMessage(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to generate embedding from Gemini API", e);
        } catch (Exception e) {
            log.error("Error calling Gemini embedding API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate embedding from Gemini API", e);
        }
    }

    /**
     * Builds the request payload according to Gemini API documentation.
     * Following the format:
     * {
     *   "model": "models/gemini-embedding-exp-03-07",
     *   "content": {
     *     "parts": [{
     *       "text": "What is the meaning of life?"
     *     }]
     *   },
     *   "taskType": "SEMANTIC_SIMILARITY"
     * }
     * @param text the input text to embed
     * @param taskType the type of embedding task
     * @return a Map representing the request payload
     */
    private Map<String, Object> buildEmbeddingRequest(String text, String taskType) {
        Map<String, Object> request = new HashMap<>();

        // Use the embedding model name from configuration.
        request.put("model", "models/" + geminiConfig.getEmbeddingModelName());

        // Create the content structure.
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", text);

        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(textPart);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", parts);

        request.put("content", content);

        // Add taskType if provided.
        if (taskType != null && !taskType.isEmpty()) {
            request.put("taskType", taskType);
        }

        return request;
    }
}
