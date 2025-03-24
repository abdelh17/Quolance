package com.quolance.quolance_api.services.text;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;

public interface TextGenerationService {

    String generateText(String prompt, User user);

    String generateText(String endpoint, User user, String userPrompt);

    String generateText(PromptType promptType, User user, String userPrompt);
}
