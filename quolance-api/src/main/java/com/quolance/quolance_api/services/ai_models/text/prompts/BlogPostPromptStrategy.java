package com.quolance.quolance_api.services.ai_models.text.prompts;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BlogPostPromptStrategy implements PromptStrategy {

    @Value("${ai.base-prompts.blogpost}")
    private String basePrompt;

    @Override
    public PromptType getType() {
        return PromptType.BLOGPOST;
    }

    @Override
    public String generatePrompt(User user, String userPrompt) {
        return basePrompt + " " + userPrompt;
    }
}