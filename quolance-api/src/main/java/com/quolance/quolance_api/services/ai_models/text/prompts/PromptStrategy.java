package com.quolance.quolance_api.services.ai_models.text.prompts;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;

public interface PromptStrategy {
    /**
     * Returns the prompt type associated with this strategy.
     */
    PromptType getType();

    /**
     * Generate a complete prompt by combining base prompt, user data, and the user-supplied text.
     *
     * @param user the user object
     * @param userPrompt additional text provided by the user
     * @return the final prompt to be sent to the AI API
     */
    String generatePrompt(User user, String userPrompt);
}
