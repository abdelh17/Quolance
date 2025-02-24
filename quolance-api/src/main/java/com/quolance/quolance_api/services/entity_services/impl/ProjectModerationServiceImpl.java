package com.quolance.quolance_api.services.entity_services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.project.ProjectEvaluationResult;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.services.ai_models.AiService;
import com.quolance.quolance_api.services.ai_models.GeminiService;
import com.quolance.quolance_api.services.entity_services.ProjectModerationService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class ProjectModerationServiceImpl implements ProjectModerationService {
    private final ObjectMapper objectMapper;

    private final AiService aiService;

    public ProjectModerationServiceImpl(ObjectMapper objectMapper, GeminiService aiService) {
        this.objectMapper = objectMapper;
        this.aiService = aiService;
    }
    private static final double DENY_THRESHOLD = 0.9;
    private static final double MANUAL_REVIEW_THRESHOLD = 0.7;
    private String projectModerationPrompt;

    private static final List<String> ILLEGAL_KEYWORDS = Arrays.asList(
            "hack into", "crack passwords", "exploit vulnerabilities",
            "steal data", "commit fraud", "illegal activities"
    );

    private static final List<String> SUSPICIOUS_KEYWORDS = Arrays.asList(
            "fake accounts", "mass spam", "black hat",
            "automatic posting", "bulk scraping"
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
        aiService.validateApiConfig();
        log.info("Project Moderation Service initialized successfully");
    }

    private void setupContentFilters() {
        Map<String, List<String>> contentFilters = new HashMap<>();
        contentFilters.put("ILLEGAL_ACTIVITY", ILLEGAL_KEYWORDS);
        contentFilters.put("SUSPICIOUS_CONTENT", SUSPICIOUS_KEYWORDS);
        contentFilters.put("HIGH_RISK_SECURITY", HIGH_RISK_SECURITY_KEYWORDS);
    }

    private void initializePrompt() {
        projectModerationPrompt = """
                You are an AI project moderator for a freelancing platform. Your task is to review project submissions to ensure they meet platform guidelines. 
                When in doubt, mark for manual review rather than rejecting outright.Your response must be a single, valid JSON object in this exact format:
                
                {
                "approved": false,
                "confidenceScore": 1.0,
                "reason": "explain rejection reason here",
                "flags": ["ILLEGAL_ACTIVITY", "UNPROFESSIONAL_CONTENT"],
                "requiresManualReview": false
                }
                
                Evaluation Criteria:
                - Professional Language
                - Ensure clear and respectful wording
                - Avoid projects with excessive profanity, hate speech, or offensive content
                
                Legal & Ethical Compliance
                - Reject projects involving illegal activities
                - Reject scams, fraudulent services, or unethical requests
                
                Relevance to Freelancing
                - Reject job offers (permanent employment positions)
                - Reject advertisements or disguised marketing posts
                - Ensure the project aligns with freelance contract work
                
                Guidelines:
                - Context Matters: Don't flag technical terms without clear justification.
                - Benefit of the Doubt: If unclear, prioritize manual review instead of rejection.
                - Flexibility for Clients: Non-technical clients may struggle with precise details—allow room for freelancer discussions.
                - Encourage Genuine Projects: If a project is legal, safe, and has enough detail to initiate a conversation, approve it.
                - You must give a detailed reason in the case you do not approve a project. Mention the terms or phrases that led to the rejection. Explain yourself.
                Common Flags to Use:
                - ILLEGAL_ACTIVITY: Clearly illegal or unethical services
                - UNPROFESSIONAL_CONTENT: Extreme use of inappropriate or offensive language
                - SUSPICIOUS_INTENT: Potential scams, fraud, or harmful intent
                
                HIGH_RISK_SECURITY: Sensitive security-related requests requiring expert review
                
                NEEDS_CLARIFICATION: Ambiguous but potentially valid projects
                
                Project Submission Details:
                Title: %s
                Description: %s
                Category: %s
                Price Range: %s
                Timeline: %s
                Experience Level: %s
                """;
    }

    @Override
    public ProjectEvaluationResult evaluateProject(Project project) {
        log.debug("Starting moderation for project: {}", project.getId());

        ProjectEvaluationResult preCheckResult = performPreCheck(project);
        if (preCheckResult != null) {
            log.info("Project {} failed pre-check moderation", project.getId());
            return preCheckResult;
        }

        try {
            String prompt = formatProjectForPrompt(project);
            Map<String, Object> response = aiService.callAiApi(prompt);
            return parseAndValidateResponse(response);
        } catch (Exception e) {
            log.error("Moderation failed for project {}: {}", project.getId(), e.getMessage(), e);
            return handleModerationError(e);
        }
    }

    private ProjectEvaluationResult performPreCheck(Project project) {
        String content = (project.getTitle() + " " + project.getDescription()).toLowerCase();

        if (ILLEGAL_KEYWORDS.stream().anyMatch(content::contains)) {
            return ProjectEvaluationResult.builder()
                    .approved(false)
                    .confidenceScore(1.0)
                    .reason("Project contains terms associated with illegal activities")
                    .flags(List.of("ILLEGAL_ACTIVITY"))
                    .requiresManualReview(true)
                    .build();
        }

        if (SUSPICIOUS_KEYWORDS.stream().anyMatch(content::contains)) {
            return ProjectEvaluationResult.builder()
                    .approved(false)
                    .confidenceScore(0.8)
                    .reason("Project requires review due to potentially suspicious content")
                    .flags(List.of("SUSPICIOUS_CONTENT"))
                    .requiresManualReview(true)
                    .build();
        }

        if (HIGH_RISK_SECURITY_KEYWORDS.stream().anyMatch(content::contains)) {
            return ProjectEvaluationResult.builder()
                    .approved(false)
                    .confidenceScore(0.8)
                    .reason("Project contains high-risk security terms requiring verification")
                    .flags(List.of("HIGH_RISK_SECURITY"))
                    .requiresManualReview(true)
                    .build();
        }

        return null;
    }

    private String formatProjectForPrompt(Project project) {
        return String.format(projectModerationPrompt,
                project.getTitle(),
                project.getDescription(),
                project.getCategory(),
                project.getPriceRange(),
                project.getExpectedDeliveryTime(),
                project.getExperienceLevel()
        );
    }

    private ProjectEvaluationResult parseAndValidateResponse(Map<String, Object> response) {
        try {
            String cleanedText = aiService.cleanApiResponse(response);
            ProjectEvaluationResult result = objectMapper.readValue(cleanedText,
                    ProjectEvaluationResult.class);
            return applyModerationRules(result);
        } catch (Exception e) {
            log.error("Failed to parse moderation response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse moderation response", e);
        }
    }


    private ProjectEvaluationResult applyModerationRules(ProjectEvaluationResult result) {
        if (result.getConfidenceScore() < DENY_THRESHOLD) {
            if (result.getConfidenceScore() >= MANUAL_REVIEW_THRESHOLD) {
                result.setApproved(false);
                result.setRequiresManualReview(true);
                if (result.getFlags() == null) {
                    result.setFlags(new ArrayList<>());
                }
                result.getFlags().add("NEEDS_MANUAL_REVIEW");
                result.setReason("Project requires more review due to uncertainty: " + result.getReason());
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

    private ProjectEvaluationResult handleModerationError(Exception e) {
        return ProjectEvaluationResult.builder()
                .approved(false)
                .confidenceScore(1.0)
                .reason("Moderation system error: " + e.getMessage())
                .flags(List.of("SYSTEM_ERROR"))
                .requiresManualReview(true)
                .build();
    }
}