package com.quolance.quolance_api.services.ai_models;

import com.quolance.quolance_api.configs.GeminiConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService implements AiService {
    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;


    @Override
    public Map<String, Object> callAiApi(String prompt) {
        try {
            return geminiWebClient.post()
                    .uri(geminiConfig.getBaseUrl() + "?key=" + geminiConfig.getKey())
                    .bodyValue(buildGeminiRequest(prompt))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            log.error("Error calling Gemini API for string input: {}", e.getMessage());
            throw new RuntimeException("Failed to call moderation API", e);
        }
    }

    @Override
    public Map<String, Object> callAiApi(JSONObject jsonObject) {
        try {
            return geminiWebClient.post()
                    .uri(geminiConfig.getBaseUrl() + "?key=" + geminiConfig.getKey())
                    .bodyValue(buildGeminiRequestFromJson(jsonObject))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            log.error("Error calling Gemini API for json input: {}", e.getMessage());
            throw new RuntimeException("Failed to call chatbot API", e);
        }
    }

    @Override
    public String cleanApiResponse(Object response) {
        String responseText = extractResponseText((Map<String, Object>) response);
        return cleanResponseText(responseText);
    }

    public String extractResponseText(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new IllegalStateException("No candidates in response");
            }

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            if (content == null) {
                throw new IllegalStateException("No content in first candidate");
            }

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                throw new IllegalStateException("No parts in content");
            }

            String text = (String) parts.get(0).get("text");
            if (text == null || text.trim().isEmpty()) {
                throw new IllegalStateException("Empty response text");
            }

            return text;
        } catch (Exception e) {
            throw new IllegalStateException("Invalid response format from API", e);
        }
    }

    private String cleanResponseText(String text) {
        String cleaned = text.trim();
        cleaned = cleaned.replaceAll("```json\\s*", "")
                .replaceAll("```\\s*$", "")
                .trim();

        int start = cleaned.indexOf("{");
        int end = cleaned.lastIndexOf("}") + 1;
        if (start >= 0 && end > start) {
            cleaned = cleaned.substring(start, end);
        }

        return cleaned;
    }

    public void validateApiConfig() {
        if (geminiConfig.getKey() == null || geminiConfig.getKey().isEmpty()) {
            throw new IllegalStateException("Gemini API is not properly configured");
        }
    }

    private Map<String, Object> buildGeminiRequest(String prompt) {
        return Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "safetySettings", List.of(
                        Map.of(
                                "category", "HARM_CATEGORY_DANGEROUS_CONTENT",
                                "threshold", "BLOCK_MEDIUM_AND_ABOVE"
                        )
                )
        );
    }

    private Map<String, Object> buildGeminiRequestFromJson(JSONObject jsonObject) {
        List<Map<String, Object>> contents = new ArrayList<>();

        for (int i = 0; i < jsonObject.getJSONArray("contents").length(); i++) {
            JSONObject contentItem = jsonObject.getJSONArray("contents").getJSONObject(i);
            String role = contentItem.getString("role");

            List<Map<String, Object>> parts = new ArrayList<>();
            JSONObject partsItem = contentItem.getJSONArray("parts").getJSONObject(0);
            parts.add(Map.of("text", partsItem.getString("text")));

            contents.add(Map.of("role", role, "parts", parts));
        }

        return Map.of(
                "contents", contents,
                "safetySettings", List.of(
                        Map.of(
                                "category", "HARM_CATEGORY_DANGEROUS_CONTENT",
                                "threshold", "BLOCK_MEDIUM_AND_ABOVE"
                        )
                )
        );
    }



}
