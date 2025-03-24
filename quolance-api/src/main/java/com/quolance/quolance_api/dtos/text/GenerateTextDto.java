package com.quolance.quolance_api.dtos.text;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenerateTextDto {
    @NotBlank(message = "Prompt must not be blank")
    private String prompt;
}
