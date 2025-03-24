package com.quolance.quolance_api.services.text.prompts;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AboutPromptStrategy implements PromptStrategy {

    @Value("${ai.base-prompts.about}")
    private String basePrompt;

    @Override
    public PromptType getType() {
        return PromptType.ABOUT;
    }

    @Override
    public String generatePrompt(User user, String userPrompt) {
        // Example: Combine the base prompt with user details
        String userDetails = "User " + user.getUsername() + " with role " + user.getRole() + ". ";
        return basePrompt + userDetails + userPrompt;
    }
}
