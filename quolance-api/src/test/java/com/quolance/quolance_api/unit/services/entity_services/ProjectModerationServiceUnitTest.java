package com.quolance.quolance_api.unit.services.entity_services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.project.ProjectEvaluationResult;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.ExpectedDeliveryTime;
import com.quolance.quolance_api.entities.enums.FreelancerExperienceLevel;
import com.quolance.quolance_api.entities.enums.PriceRange;
import com.quolance.quolance_api.entities.enums.ProjectCategory;
import com.quolance.quolance_api.services.ai_models.GeminiService;
import com.quolance.quolance_api.services.entity_services.impl.ProjectModerationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectModerationServiceUnitTest {

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private GeminiService aiService;

    @InjectMocks
    private ProjectModerationServiceImpl projectModerationService;

    private Project project;
    private Map<String, Object> aiResponse;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(UUID.randomUUID());
        project.setTitle("Web Development Project");
        project.setDescription("I need a developer to build a website for my business");
        project.setCategory(ProjectCategory.WEB_DEVELOPMENT);
        project.setPriceRange(PriceRange.BETWEEN_1000_5000);
        project.setExpectedDeliveryTime(ExpectedDeliveryTime.IMMEDIATELY);
        project.setExperienceLevel(FreelancerExperienceLevel.EXPERT);

        aiResponse = new HashMap<>();
        aiResponse.put("text", "{\"approved\": false, \"confidenceScore\": 0.65, \"reason\": \"Project seems legitimate but confidence is low\", \"flags\": [\"LOW_CONFIDENCE\"], \"requiresManualReview\": false}");

        doNothing().when(aiService).validateApiConfig();
        projectModerationService.initialize();
    }

    @Test
    void evaluateProject_ShouldApproveValidProject() throws Exception {
        ProjectEvaluationResult approvedResult = ProjectEvaluationResult.builder()
                .approved(true)
                .confidenceScore(0.95)
                .reason("Project appears legitimate")
                .flags(List.of())
                .requiresManualReview(false)
                .build();

        when(aiService.callAiApi(anyString())).thenReturn(aiResponse);
        when(aiService.cleanApiResponse(any(Map.class))).thenReturn("{\"approved\": true, \"confidenceScore\": 0.95, \"reason\": \"Project appears legitimate\", \"flags\": [], \"requiresManualReview\": false}");
        when(objectMapper.readValue(anyString(), eq(ProjectEvaluationResult.class))).thenReturn(approvedResult);

        ProjectEvaluationResult result = projectModerationService.evaluateProject(project);

        assertThat(result).isEqualTo(approvedResult);
    }

    @Test
    void evaluateProject_ShouldHandleParsingError() throws Exception {
        when(aiService.callAiApi(anyString())).thenReturn(aiResponse);
        when(aiService.cleanApiResponse(any(Map.class))).thenReturn("Invalid JSON");
        when(objectMapper.readValue(anyString(), eq(ProjectEvaluationResult.class))).thenThrow(new RuntimeException("JSON parsing error"));

        ProjectEvaluationResult result = projectModerationService.evaluateProject(project);

        assertThat(result.isApproved()).isFalse();
        assertThat(result.getFlags()).contains("SYSTEM_ERROR");
        assertThat(result.isRequiresManualReview()).isTrue();
    }

    // @Test
    // void evaluateProject_ShouldLowConfidenceReject() throws Exception {
    //     // Mock AI Response JSON
    //     String lowConfidenceJsonResponse = """
    //         {
    //             "approved": false,
    //             "confidenceScore": 0.65,
    //             "reason": "Project seems legitimate but confidence is low",
    //             "flags": ["LOW_CONFIDENCE"],
    //             "requiresManualReview": false
    //         }
    //     """;
    
    //     // Expected Parsed Object
    //     ProjectEvaluationResult lowConfidenceResult = ProjectEvaluationResult.builder()
    //             .approved(false)
    //             .confidenceScore(0.65)
    //             .reason("Project seems legitimate but confidence is low")
    //             .flags(List.of("LOW_CONFIDENCE")) 
    //             .requiresManualReview(false)
    //             .build();
    
    //     // Mock AI API Response
    //     Map<String, Object> freshAiResponse = new HashMap<>();
    //     freshAiResponse.put("text", lowConfidenceJsonResponse);
    
    //     when(aiService.callAiApi(anyString())).thenReturn(freshAiResponse);
    //     when(aiService.cleanApiResponse(any(Map.class))).thenReturn(lowConfidenceJsonResponse);
    //     when(objectMapper.readValue(eq(lowConfidenceJsonResponse), eq(ProjectEvaluationResult.class)))
    //             .thenReturn(lowConfidenceResult);
    

    //     ProjectEvaluationResult result = projectModerationService.evaluateProject(project);
    

    //     assertThat(result).isNotNull();
    //     assertThat(result.isApproved()).isFalse();
    //     assertThat(result.getFlags()).isNotNull().contains("LOW_CONFIDENCE"); // ✅ Fix: Direct contains() check
    // }
    
    
}
