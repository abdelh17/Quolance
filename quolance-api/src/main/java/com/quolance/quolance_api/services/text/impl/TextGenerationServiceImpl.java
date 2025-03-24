package com.quolance.quolance_api.services.text.impl;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import com.quolance.quolance_api.services.ai_models.AiService;
import com.quolance.quolance_api.services.text.prompts.PromptStrategyRegistry;
import com.quolance.quolance_api.services.text.TextGenerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class TextGenerationServiceImpl implements TextGenerationService {

    // Delegate text generation to your existing Gemini-based AI service
    private final AiService aiService;

    // Registry of prompt strategies
    private final PromptStrategyRegistry promptStrategyRegistry;

    @Override
    public String generateText(String prompt, User user) {
        Map<String, Object> response = aiService.callAiApi(prompt);
        return aiService.cleanApiResponse(response);
    }

    @Override
    public String generateText(String endpoint, User user, String userPrompt) {
        // For backward compatibility if needed – you could convert a String to PromptType
        PromptType type = PromptType.valueOf(endpoint.toUpperCase());
        return generateText(type, user, userPrompt);
    }

    @Override
    public String generateText(PromptType promptType, User user, String userPrompt) {
        // Retrieve the appropriate strategy based on the prompt type
        String finalPrompt = promptStrategyRegistry.getStrategy(promptType).generatePrompt(user, userPrompt);
        return generateText(finalPrompt, user);
    }
}
