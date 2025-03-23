package com.quolance.quolance_api.services.chat.impl;

import com.quolance.quolance_api.services.ChatRequest;
import com.quolance.quolance_api.services.ai_models.AiService;
import com.quolance.quolance_api.services.ai_models.GeminiService;
import com.quolance.quolance_api.services.chat.ChatbotService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {
    private final AiService aiService;
    private List<MessagePart> conversationHistory = new ArrayList<>();
    private static final String INSTRUCTIONS = """
            You are a chatbot to help users so keep a light and fun tone. 
            Please respond with the most relevant information from the FAQ. Keep your answer short. 
            If you don't know the answer, you must ask the user to contact the support team. 
            Do not mention that you are getting the information from an FAQ. Refuse to answer questions that are
            irrelevant to the context and platform. Do not prepend you in your response.
            """;
    private final String faqContext;

    public ChatbotServiceImpl(GeminiService aiService) {
        this.aiService = aiService;
        this.faqContext = searchFAQ();
    }

    @Override
    public String chat(ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage();
        log.info("User message: {}", userMessage);

        return getChatbotReply(userMessage);
    }

    private String searchFAQ() {
        try {
            ClassPathResource resource = new ClassPathResource("faq.txt");
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
            String faqData = reader.lines().collect(Collectors.joining("\n"));
            reader.close();

            return faqData;
        } catch (Exception e) {
            log.error("Error reading FAQ data: {}", e.getMessage());
        }
        return "";
    }

    private String getChatbotReply(String userMessage) {
        JSONObject requestBody = buildRequestBody(userMessage);

        log.info("Request body: {}", requestBody);
        Map<String, Object> response = aiService.callAiApi(requestBody);
        String chatbotReply = aiService.cleanApiResponse(response);

        conversationHistory.add(new MessagePart("model", chatbotReply));
        log.info("Chatbot reply: {}", chatbotReply);
        return chatbotReply;
    }

    private JSONObject buildRequestBody(String userMessage) {
        log.info("Building request body for user message: {}", userMessage);
        conversationHistory.add(new MessagePart("user", userMessage));

        JSONObject requestBody = new JSONObject();
        List<JSONObject> contents = new ArrayList<>();

        JSONObject instructionsMessage = new JSONObject();
        instructionsMessage.put("role", "user");
        List<JSONObject> instructionsParts = new ArrayList<>();
        JSONObject instructionsPart = new JSONObject();
        instructionsPart.put("text", INSTRUCTIONS);
        instructionsParts.add(instructionsPart);
        instructionsMessage.put("parts", instructionsParts);
        contents.add(instructionsMessage);

        JSONObject faqMessage = new JSONObject();
        faqMessage.put("role", "user");
        List<JSONObject> faqParts = new ArrayList<>();
        JSONObject faqPart = new JSONObject();
        faqPart.put("text", "Here is the FAQ information: " + faqContext);
        faqParts.add(faqPart);
        faqMessage.put("parts", faqParts);
        contents.add(faqMessage);

        for (MessagePart message : conversationHistory) {
            JSONObject historyMessage = new JSONObject();
            historyMessage.put("role", message.getRole());

            List<JSONObject> historyParts = new ArrayList<>();
            JSONObject historyPart = new JSONObject();
            historyPart.put("text", message.getText());
            historyParts.add(historyPart);

            historyMessage.put("parts", historyParts);
            contents.add(historyMessage);
        }

        requestBody.put("contents", contents);
        return requestBody;
    }

    @Getter
    @AllArgsConstructor
    private static class MessagePart {
        private String role;
        private String text;
    }
}
