package com.quolance.quolance_api.services.text;

import com.quolance.quolance_api.entities.User;

public interface TextGenerationService {
    String generateText(String prompt, User user);
}
