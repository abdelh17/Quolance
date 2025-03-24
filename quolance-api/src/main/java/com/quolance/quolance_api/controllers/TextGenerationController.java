package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.text.GenerateTextDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.text.TextGenerationService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/text-generation")
@RequiredArgsConstructor
public class TextGenerationController {

    private final TextGenerationService textGenerationService;

    @PostMapping("/generate")
    @Operation(
            summary = "Generate text content",
            description = "Generate dynamic text content using the provided prompt via the OpenAI API."
    )
    public ResponseEntity<String> generateText(@RequestBody GenerateTextDto generateTextDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        log.info("User with ID {} is generating text with prompt: {}", user.getId(), generateTextDto.getPrompt());
        String generatedText = textGenerationService.generateText(generateTextDto.getPrompt(), user);
        return ResponseEntity.ok(generatedText);
    }
}