package com.quolance.quolance_api.dtos.text;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GenerateApplicationLetterDto {
    private String projectId;
    private String prompt;
}
