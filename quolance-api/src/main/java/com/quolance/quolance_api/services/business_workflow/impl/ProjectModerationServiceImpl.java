package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.configs.GeminiConfig;
import com.quolance.quolance_api.dtos.project.ProjectCreateResponseDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.services.business_workflow.ProjectModerationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectModerationServiceImpl implements ProjectModerationService {
    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;

    private static final double DENY_THRESHOLD = 0.8;
    private Map<String, List<String>> contentFilters;
    private String initializedPrompt;

    private static final List<String> ILLEGAL_KEYWORDS = Arrays.asList(
            "hack", "hacking", "crack", "cracking", "exploit",
            "bypass", "steal", "fraud", "illegal", "password"
    );

    private static final List<String> SUSPICIOUS_KEYWORDS = Arrays.asList(
            "urgent", "asap", "fake", "duplicate", "spam", "bot",
            "automatic", "scrape", "scraping"
    );

    @PostConstruct
    public void initialize() {
        log.info("Initializing Project Moderation Service");
        setupContentFilters();
        initializePrompt();
        validateApiConfig();
        log.info("Project Moderation Service initialized successfully");
    }

    private void setupContentFilters() {
        contentFilters = new HashMap<>();
        contentFilters.put("ILLEGAL_ACTIVITY", ILLEGAL_KEYWORDS);
        contentFilters.put("SUSPICIOUS_CONTENT", SUSPICIOUS_KEYWORDS);
    }

    private void initializePrompt() {
        initializedPrompt = """
            You are a STRICT project moderator for a professional freelance platform.
            Review this project for professionalism, clarity, and legitimacy.
            Respond with a single valid JSON object in exactly this format:
            {
                "approved": false,
                "confidenceScore": 1.0,
                "reason": "explain rejection reason here",
                "flags": ["ILLEGAL_ACTIVITY", "UNPROFESSIONAL_CONTENT"],
                "requiresManualReview": false
            }
            
            Consider these aspects:
            1. Professional language and clarity
            2. Legal and ethical compliance
            3. Realistic expectations (timeline/budget)
            4. Complete and clear requirements
            5. Appropriate technical scope
            
            Project to review:
            Title: %s
            Description: %s
            Category: %s
            Price Range: %s
            Timeline: %s
            Experience Level: %s
            
            Common flags to use:
            - ILLEGAL_ACTIVITY: For projects involving hacking, fraud, or other illegal activities
            - UNPROFESSIONAL_CONTENT: For projects with inappropriate language or content
            - UNCLEAR_REQUIREMENTS: For vague or incomplete project specifications
            - UNREALISTIC_EXPECTATIONS: For projects with mismatched timeline/budget/scope
            - SUSPICIOUS_INTENT: For projects that seem potentially harmful
            - SECURITY_SENSITIVE: For projects requiring extra security review
            """;
    }

    @Override
    public ProjectCreateResponseDto moderateProject(Project project) {
        log.debug("Starting moderation for project: {}", project.getId());

        ProjectCreateResponseDto preCheckResult = performPreCheck(project);
        if (preCheckResult != null) {
            log.info("Project {} failed pre-check moderation", project.getId());
            return preCheckResult;
        }

        try {
            String prompt = formatPrompt(project);
            Map<String, Object> response = callGeminiApi(prompt);
            log.debug("Received raw API response for project {}", project.getId());
            return parseAndValidateResponse(response);
        } catch (Exception e) {
            log.error("Moderation failed for project {}: {}", project.getId(), e.getMessage(), e);
            return handleModerationError(e);
        }
    }

    private ProjectCreateResponseDto performPreCheck(Project project) {
        String content = (project.getTitle() + " " + project.getDescription()).toLowerCase();

        for (Map.Entry<String, List<String>> filter : contentFilters.entrySet()) {
            if (filter.getValue().stream().anyMatch(content::contains)) {
                return ProjectCreateResponseDto.builder()
                        .approved(false)
                        .confidenceScore(1.0)
                        .reason("Project automatically rejected due to " + filter.getKey().toLowerCase())
                        .flags(List.of(filter.getKey(), "AUTOMATIC_REJECTION"))
                        .requiresManualReview(false)
                        .build();
            }
        }
        return null;
    }

    private void validateApiConfig() {
        if (geminiConfig.getKey() == null || geminiConfig.getKey().isEmpty()) {
            log.error("Gemini API key not configured");
            throw new IllegalStateException("Gemini API is not properly configured");
        }
    }

    private String formatPrompt(Project project) {
        log.debug("Formatting prompt for project: {}", project.getId());
        return String.format(initializedPrompt,
                project.getTitle(),
                project.getDescription(),
                project.getCategory(),
                project.getPriceRange(),
                project.getExpectedDeliveryTime(),
                project.getExperienceLevel()
        );
    }

    private Map<String, Object> callGeminiApi(String prompt) {
        log.debug("Calling Gemini API");
        try {
            return geminiWebClient.post()
                    .uri(geminiConfig.getBaseUrl() + "?key=" + geminiConfig.getKey())
                    .bodyValue(buildGeminiRequest(prompt))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
            throw new RuntimeException("Failed to call moderation API", e);
        }
    }

    private Map<String, Object> buildGeminiRequest(String prompt) {
        return Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "safetySettings", List.of(
                        Map.of(
                                "category", "HARM_CATEGORY_DANGEROUS_CONTENT",
                                "threshold", "BLOCK_MEDIUM_AND_ABOVE"
                        )
                )
        );
    }

    private ProjectCreateResponseDto parseAndValidateResponse(Map<String, Object> response) {
        try {
            String responseText = extractResponseText(response);
            log.debug("Extracted response text: {}", responseText);

            String cleanedText = cleanResponseText(responseText);
            log.debug("Cleaned response text: {}", cleanedText);

            ProjectCreateResponseDto result = objectMapper.readValue(cleanedText,
                    ProjectCreateResponseDto.class);
            return applyModerationRules(result);
        } catch (Exception e) {
            log.error("Failed to parse moderation response: {}", e.getMessage());
            log.error("Raw response: {}", response);
            throw new RuntimeException("Failed to parse moderation response", e);
        }
    }

    private String extractResponseText(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new IllegalStateException("No candidates in response");
            }

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            if (content == null) {
                throw new IllegalStateException("No content in first candidate");
            }

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                throw new IllegalStateException("No parts in content");
            }

            String text = (String) parts.get(0).get("text");
            if (text == null || text.trim().isEmpty()) {
                throw new IllegalStateException("Empty response text");
            }

            return text;
        } catch (Exception e) {
            log.error("Failed to extract response text: {}", e.getMessage());
            throw new IllegalStateException("Invalid response format from API", e);
        }
    }

    private String cleanResponseText(String text) {
        String cleaned = text.trim();
        // Remove markdown code block indicators if present
        cleaned = cleaned.replaceAll("```json\\s*", "")
                .replaceAll("```\\s*$", "")
                .trim();

        // Find the first { and last } to extract just the JSON object
        int start = cleaned.indexOf("{");
        int end = cleaned.lastIndexOf("}") + 1;
        if (start >= 0 && end > start) {
            cleaned = cleaned.substring(start, end);
        }

        return cleaned;
    }

    private ProjectCreateResponseDto applyModerationRules(ProjectCreateResponseDto result) {
        if (result.getFlags() != null && !result.getFlags().isEmpty() ||
                result.getConfidenceScore() < DENY_THRESHOLD) {

            result.setApproved(false);
            result.setConfidenceScore(1.0);
            result.setRequiresManualReview(false);

            if (result.getFlags() == null) {
                result.setFlags(new ArrayList<>());
            }
            if (result.getConfidenceScore() < DENY_THRESHOLD) {
                result.getFlags().add("LOW_CONFIDENCE");
            }
        }
        return result;
    }

    private ProjectCreateResponseDto handleModerationError(Exception e) {
        return ProjectCreateResponseDto.builder()
                .approved(false)
                .confidenceScore(1.0)
                .reason("Moderation system error: " + e.getMessage())
                .flags(List.of("SYSTEM_ERROR"))
                .requiresManualReview(true)
                .build();
    }
}