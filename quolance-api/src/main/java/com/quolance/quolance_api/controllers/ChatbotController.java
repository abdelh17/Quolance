package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.services.ChatRequest;
import com.quolance.quolance_api.services.chat.ChatbotService;
import com.quolance.quolance_api.util.FeatureToggle;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@AllArgsConstructor
@Slf4j
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final FeatureToggle featureToggle;

    @PostMapping
    public String chat(@RequestBody ChatRequest chatRequest) {
        log.info("User making a chatbot request");
        if (featureToggle.isEnabled("useChatbot")) {
            log.info("Chatbot feature is enabled...");
            return chatbotService.chat(chatRequest);
        }

        log.info("Chatbot feature is disabled...");
        return "The chatbot is currently disabled, come back later!";
    }


}


