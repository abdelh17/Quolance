package com.quolance.quolance_api.services.ai_models.text.prompts;

import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import com.quolance.quolance_api.entities.enums.Tag;
import com.quolance.quolance_api.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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
        ParsedPrompt parsed = parseProjectId(userPrompt);

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
                if (project.getTags() != null && !project.getTags().isEmpty()) {
                    projectContext.append("Tags: ").append(project.getTags()).append(". ");
                }
            }
        }

        Profile profile = user.getProfile();
        StringBuilder userDetails = new StringBuilder("Freelancer Details: ");
        appendIfNotBlank(userDetails, "First Name: ", user.getFirstName());
        appendIfNotBlank(userDetails, "Last Name: ", user.getLastName());
        if (user.getRole() != null) {
            userDetails.append("Role: ").append(user.getRole().name()).append(". ");
        }
        if (profile != null) {
            if (profile.getContactEmail() != null && !profile.getContactEmail().isBlank()) {
                userDetails.append("Contact Email: ").append(profile.getContactEmail()).append(". ");
            }
            if (profile.getCity() != null && !profile.getCity().isBlank()) {
                userDetails.append("City: ").append(profile.getCity()).append(". ");
            }
            if (profile.getState() != null && !profile.getState().isBlank()) {
                userDetails.append("State: ").append(profile.getState()).append(". ");
            }
            if (profile.getExperienceLevel() != null) {
                userDetails.append("Freelancer Experience Level: ").append(profile.getExperienceLevel().name()).append(". ");
            }
            if (profile.getAvailability() != null) {
                userDetails.append("Availability: ").append(profile.getAvailability().name()).append(". ");
            }
            if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
                Set<Tag> skills = profile.getSkills();
                String skillList = skills.stream()
                        .map(Tag::name)
                        .collect(Collectors.joining(", "));
                userDetails.append("Skills: ").append(skillList).append(". ");
            }
            if (profile.getCertifications() != null && !profile.getCertifications().isEmpty()) {
                String certList = String.join(", ", profile.getCertifications());
                userDetails.append("Certifications: ").append(certList).append(". ");
            }
            if (profile.getLanguagesSpoken() != null && !profile.getLanguagesSpoken().isEmpty()) {
                String langList = String.join(", ", profile.getLanguagesSpoken());
                userDetails.append("Languages Spoken: ").append(langList).append(". ");
            }
            if (profile.getBio() != null && !profile.getBio().isBlank()) {
                userDetails.append("Current Bio: ").append(profile.getBio()).append(". ");
            }
            if (profile.getWorkExperiences() != null && !profile.getWorkExperiences().isEmpty()) {
                userDetails.append("Number of Work Experiences: ")
                        .append(profile.getWorkExperiences().size())
                        .append(". ");
            }
            if (profile.getProjectExperiences() != null && !profile.getProjectExperiences().isEmpty()) {
                userDetails.append("Project Experiences Count: ")
                        .append(profile.getProjectExperiences().size())
                        .append(". ");
            }
            if (profile.getSocialMediaLinks() != null && !profile.getSocialMediaLinks().isEmpty()) {
                String links = String.join(", ", profile.getSocialMediaLinks());
                userDetails.append("Social Media Links: ").append(links).append(". ");
            }
        }

        String finalPrompt = basePrompt + projectContext + userDetails + parsed.remainingPrompt;
        return finalPrompt;
    }


    private ParsedPrompt parseProjectId(String userPrompt) {
        Pattern pattern = Pattern.compile("(ProjectID=|Project\\s*ID:)\\s*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
        Matcher matcher = pattern.matcher(userPrompt);
        if (matcher.find()) {
            String idString = matcher.group(2);
            try {
                UUID projectId = UUID.fromString(idString);
                String remainingPrompt = matcher.replaceFirst("").trim();
                return new ParsedPrompt(projectId, remainingPrompt);
            } catch (IllegalArgumentException e) {
                return new ParsedPrompt(null, userPrompt);
            }
        }
        return new ParsedPrompt(null, userPrompt);
    }


    private void appendIfNotBlank(StringBuilder sb, String label, String value) {
        if (value != null && !value.isBlank()) {
            sb.append(label).append(value).append(". ");
        }
    }


    private static class ParsedPrompt {
        final UUID projectId;
        final String remainingPrompt;

        public ParsedPrompt(UUID projectId, String remainingPrompt) {
            this.projectId = projectId;
            this.remainingPrompt = remainingPrompt;
        }
    }
}