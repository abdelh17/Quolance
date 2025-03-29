package com.quolance.quolance_api.services.ai_models.text.prompts;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ProjectPromptStrategy implements PromptStrategy {

    @Value("${ai.base-prompts.project}")
    private String basePrompt;

    @Override
    public PromptType getType() {
        return PromptType.PROJECT;
    }

    @Override
    public String generatePrompt(User user, String userPrompt) {
        return basePrompt + userPrompt;
    }
}
