package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.text.GenerateApplicationLetterDto;
import com.quolance.quolance_api.dtos.text.GenerateTextDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import com.quolance.quolance_api.services.ai_models.text.TextGenerationService;
import com.quolance.quolance_api.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/text-generation")
@RequiredArgsConstructor
public class TextGenerationController {

    private final TextGenerationService textGenerationService;

    @PostMapping("/about")
    public ResponseEntity<String> generateAboutText(@RequestBody GenerateTextDto generateTextDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        String generatedText = textGenerationService.generateText(
                PromptType.ABOUT,
                user,
                generateTextDto.getPrompt()
        );
        return ResponseEntity.ok(generatedText);
    }

    @PostMapping("/project")
    public ResponseEntity<String> generateProjectDescription(@RequestBody GenerateTextDto generateTextDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        String generatedText = textGenerationService.generateText(
                PromptType.PROJECT,
                user,
                generateTextDto.getPrompt()
        );
        return ResponseEntity.ok(generatedText);
    }

    @PostMapping("/application")
    public ResponseEntity<String> generateApplicationText(@RequestBody GenerateApplicationLetterDto dto) {
        User user = SecurityUtil.getAuthenticatedUser();

        String finalPrompt = "Project ID: " + dto.getProjectId() + ". " + dto.getPrompt();

        String generatedText = textGenerationService.generateText(
                PromptType.APPLICATION,
                user,
                finalPrompt
        );
        return ResponseEntity.ok(generatedText);
    }

    @PostMapping("/blogpost")
    public ResponseEntity<String> generateBlogPostText(@RequestBody GenerateTextDto generateTextDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        String generatedText = textGenerationService.generateText(
                PromptType.BLOGPOST,
                user,
                generateTextDto.getPrompt()
        );
        return ResponseEntity.ok(generatedText);
    }
}
