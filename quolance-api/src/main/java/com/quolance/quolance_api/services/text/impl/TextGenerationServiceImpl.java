package com.quolance.quolance_api.services.text.impl;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ai_models.AiService;
import com.quolance.quolance_api.services.text.TextGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class TextGenerationServiceImpl implements TextGenerationService {

    private final AiService aiService;

    @Override
    public String generateText(String prompt, User user) {
        // Call the Gemini API using the provided prompt
        Map<String, Object> response = aiService.callAiApi(prompt);
        // Clean the API response text and return it
        return aiService.cleanApiResponse(response);
    }
}
