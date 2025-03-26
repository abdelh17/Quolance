package com.quolance.quolance_api.services.text.prompts;

import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;

import com.quolance.quolance_api.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ApplicationPromptStrategy implements PromptStrategy {

    @Value("${ai.base-prompts.application}")
    private String basePrompt;

    private final ProjectRepository projectRepository;

    @Override
    public PromptType getType() {
        return PromptType.APPLICATION;
    }

    @Override
    public String generatePrompt(User user, String userPrompt) {
        // 1) Parse the projectId out of userPrompt (if present)
        ParsedPrompt parsed = parseProjectId(userPrompt);

        // 2) Build project context (title, description, etc.), skipping the ID
        StringBuilder projectContext = new StringBuilder();
        if (parsed.projectId != null) {
            Optional<Project> projectOpt = projectRepository.findById(parsed.projectId);
            if (projectOpt.isPresent()) {
                Project project = projectOpt.get();
                appendIfNotBlank(projectContext, "Project Title: ", project.getTitle());
                appendIfNotBlank(projectContext, "Project Description: ", project.getDescription());
                if (project.getCategory() != null) {
                    projectContext.append("Category: ").append(project.getCategory().name()).append(". ");
                }
                if (project.getPriceRange() != null) {
                    projectContext.append("Price Range: ").append(project.getPriceRange().name()).append(". ");
                }
                if (project.getExperienceLevel() != null) {
                    projectContext.append("Experience Level: ").append(project.getExperienceLevel().name()).append(". ");
                }
                if (project.getExpectedDeliveryTime() != null) {
                    projectContext.append("Expected Delivery Time: ")
                            .append(project.getExpectedDeliveryTime().name())
                            .append(". ");
                }
                if (project.getProjectStatus() != null) {
                    projectContext.append("Project Status: ").append(project.getProjectStatus().name()).append(". ");
                }
                // If there are tags
                if (project.getTags() != null && !project.getTags().isEmpty()) {
                    projectContext.append("Tags: ").append(project.getTags()).append(". ");
                }
            }
            // If not found, we do nothing—no mention of ID to the AI
        }

        // 3) Combine the base prompt, project details, and remainder of user text (no ID appended)
        return basePrompt + projectContext + parsed.remainingPrompt;
    }

    /**
     * Attempt to parse a "ProjectID=some-uuid" prefix from userPrompt.
     * Return the remainder as user text.
     * The userPrompt might look like:
     * "ProjectID=123e4567-e89b-12d3-a456-426614174000 Additional text..."
     */
    private ParsedPrompt parseProjectId(String userPrompt) {
        if (userPrompt.startsWith("ProjectID=")) {
            int spaceIndex = userPrompt.indexOf(' ');
            if (spaceIndex > 0) {
                String idString = userPrompt.substring("ProjectID=".length(), spaceIndex);
                String remainder = userPrompt.substring(spaceIndex + 1).trim();
                try {
                    UUID projectId = UUID.fromString(idString);
                    return new ParsedPrompt(projectId, remainder);
                } catch (IllegalArgumentException e) {
                    // Not a valid UUID; fallback to entire prompt
                    return new ParsedPrompt(null, userPrompt);
                }
            }
        }
        // If no parse, return the entire prompt as is
        return new ParsedPrompt(null, userPrompt);
    }

    /**
     * Helper to skip null/blank values, appending label + value if present.
     */
    private void appendIfNotBlank(StringBuilder sb, String label, String value) {
        if (value != null && !value.isBlank()) {
            sb.append(label).append(value).append(". ");
        }
    }

    /**
     * A record/class to hold the parsed project ID and remaining text.
     */
    private static class ParsedPrompt {
        final UUID projectId;
        final String remainingPrompt;

        public ParsedPrompt(UUID projectId, String remainingPrompt) {
            this.projectId = projectId;
            this.remainingPrompt = remainingPrompt;
        }
    }
}