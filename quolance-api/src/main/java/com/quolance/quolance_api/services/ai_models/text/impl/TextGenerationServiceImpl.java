package com.quolance.quolance_api.services.ai_models.text.impl;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import com.quolance.quolance_api.services.ai_models.AiService;
import com.quolance.quolance_api.services.ai_models.text.TextGenerationService;
import com.quolance.quolance_api.services.ai_models.text.prompts.PromptStrategyRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class TextGenerationServiceImpl implements TextGenerationService {

    private final AiService aiService;

    private final PromptStrategyRegistry promptStrategyRegistry;

    @Override
    public String generateText(String prompt, User user) {
        Map<String, Object> response = aiService.callAiApi(prompt);
        return aiService.cleanApiResponse(response);
    }

    @Override
    public String generateText(String endpoint, User user, String userPrompt) {
        PromptType type = PromptType.valueOf(endpoint.toUpperCase());
        return generateText(type, user, userPrompt);
    }

    @Override
    public String generateText(PromptType promptType, User user, String userPrompt) {
        String finalPrompt = promptStrategyRegistry.getStrategy(promptType).generatePrompt(user, userPrompt);
        return generateText(finalPrompt, user);
    }
}
