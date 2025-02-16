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

    private static final double DENY_THRESHOLD = 0.9;
    private static final double MANUAL_REVIEW_THRESHOLD = 0.7;
    private Map<String, List<String>> contentFilters;
    private String initializedPrompt;

    private static final List<String> ILLEGAL_KEYWORDS = Arrays.asList(
            "hack into", "crack passwords", "exploit vulnerabilities",
            "steal data", "commit fraud", "illegal activities"
    );

    private static final List<String> SUSPICIOUS_KEYWORDS = Arrays.asList(
            "fake accounts", "mass spam", "black hat",
            "automatic posting", "bulk scraping"
    );

    private static final List<String> LEGITIMATE_SECURITY_SERVICES = Arrays.asList(
            "penetration testing", "security assessment", "vulnerability assessment",
            "security audit", "security review", "security testing",
            "ethical hacking", "white hat", "security compliance",
            "code review", "security consultation"
    );

    private static final List<String> HIGH_RISK_SECURITY_KEYWORDS = Arrays.asList(
            "zero-day", "rootkit", "backdoor", "malware development",
            "system exploitation", "password cracking"
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
        contentFilters.put("HIGH_RISK_SECURITY", HIGH_RISK_SECURITY_KEYWORDS);
    }

    private void initializePrompt() {
        initializedPrompt = """
            You are a balanced project moderator for a professional freelance platform.
            Review this project for professionalism, clarity, and legitimacy.
            When in doubt, mark for manual review rather than rejecting.
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
            
            Guidelines:
            - If the project seems legitimate but unclear, request manual review
            - Consider context before flagging technical terms
            - Give benefit of doubt for ambiguous language
            
            Project to review:
            Title: %s
            Description: %s
            Category: %s
            Price Range: %s
            Timeline: %s
            Experience Level: %s
            
            Common flags to use:
            - ILLEGAL_ACTIVITY: Only for clear violations of law
            - UNPROFESSIONAL_CONTENT: Severe cases of inappropriate language
            - UNCLEAR_REQUIREMENTS: Needs clarification but may be legitimate
            - UNREALISTIC_EXPECTATIONS: Significant timeline/budget mismatches
            - SUSPICIOUS_INTENT: Strong indicators of harmful intent
            - HIGH_RISK_SECURITY: Security projects needing expert review
            - NEEDS_CLARIFICATION: For ambiguous but potentially valid projects
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
            return parseAndValidateResponse(response);
        } catch (Exception e) {
            log.error("Moderation failed for project {}: {}", project.getId(), e.getMessage(), e);
            return handleModerationError(e);
        }
    }

    private ProjectCreateResponseDto performPreCheck(Project project) {
        String content = (project.getTitle() + " " + project.getDescription()).toLowerCase();

        if (ILLEGAL_KEYWORDS.stream().anyMatch(content::contains)) {
            return ProjectCreateResponseDto.builder()
                    .approved(false)
                    .confidenceScore(1.0)
                    .reason("Project contains terms associated with illegal activities")
                    .flags(List.of("ILLEGAL_ACTIVITY"))
                    .requiresManualReview(true)
                    .build();
        }

        if (SUSPICIOUS_KEYWORDS.stream().anyMatch(content::contains)) {
            return ProjectCreateResponseDto.builder()
                    .approved(false)
                    .confidenceScore(0.8)
                    .reason("Project requires review due to potentially suspicious content")
                    .flags(List.of("SUSPICIOUS_CONTENT"))
                    .requiresManualReview(true)
                    .build();
        }

        if (HIGH_RISK_SECURITY_KEYWORDS.stream().anyMatch(content::contains)) {
            return ProjectCreateResponseDto.builder()
                    .approved(false)
                    .confidenceScore(0.8)
                    .reason("Project contains high-risk security terms requiring verification")
                    .flags(List.of("HIGH_RISK_SECURITY"))
                    .requiresManualReview(true)
                    .build();
        }

        if (LEGITIMATE_SECURITY_SERVICES.stream().anyMatch(content::contains)) {
            return null;
        }

        return null;
    }

    private void validateApiConfig() {
        if (geminiConfig.getKey() == null || geminiConfig.getKey().isEmpty()) {
            throw new IllegalStateException("Gemini API is not properly configured");
        }
    }

    private String formatPrompt(Project project) {
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
            String cleanedText = cleanResponseText(responseText);
            ProjectCreateResponseDto result = objectMapper.readValue(cleanedText,
                    ProjectCreateResponseDto.class);
            return applyModerationRules(result);
        } catch (Exception e) {
            log.error("Failed to parse moderation response: {}", e.getMessage());
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
            throw new IllegalStateException("Invalid response format from API", e);
        }
    }

    private String cleanResponseText(String text) {
        String cleaned = text.trim();
        cleaned = cleaned.replaceAll("```json\\s*", "")
                .replaceAll("```\\s*$", "")
                .trim();

        int start = cleaned.indexOf("{");
        int end = cleaned.lastIndexOf("}") + 1;
        if (start >= 0 && end > start) {
            cleaned = cleaned.substring(start, end);
        }

        return cleaned;
    }

    private ProjectCreateResponseDto applyModerationRules(ProjectCreateResponseDto result) {
        if (result.getConfidenceScore() < DENY_THRESHOLD) {
            if (result.getConfidenceScore() >= MANUAL_REVIEW_THRESHOLD) {
                result.setApproved(false);
                result.setRequiresManualReview(true);
                if (result.getFlags() == null) {
                    result.setFlags(new ArrayList<>());
                }
                result.getFlags().add("NEEDS_MANUAL_REVIEW");
                result.setReason("Project requires human review due to uncertainty: " + result.getReason());
            } else {
                result.setApproved(false);
                result.setRequiresManualReview(false);
                if (result.getFlags() == null) {
                    result.setFlags(new ArrayList<>());
                }
                result.getFlags().add("LOW_CONFIDENCE");
            }
        }

        if (result.getFlags() != null && result.getFlags().contains("HIGH_RISK_SECURITY")) {
            result.setRequiresManualReview(true);
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