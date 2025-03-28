package com.quolance.quolance_api.services.ai_models.text.prompts;

import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.PromptType;
import com.quolance.quolance_api.entities.enums.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class AboutPromptStrategy implements PromptStrategy {

    @Value("${ai.base-prompts.about}")
    private String basePrompt;

    @Override
    public PromptType getType() {
        return PromptType.ABOUT;
    }

    @Override
    public String generatePrompt(User user, String userPrompt) {
        Profile profile = user.getProfile();
        StringBuilder userDetails = new StringBuilder();

        // Name
        appendIfNotBlank(userDetails, "First Name: ", user.getFirstName());
        appendIfNotBlank(userDetails, "Last Name: ", user.getLastName());

        // Role
        if (user.getRole() != null) {
            userDetails.append("Role: ").append(user.getRole().name()).append(". ");
        }

        // Contact Email
        if (profile != null && profile.getContactEmail() != null && !profile.getContactEmail().isBlank()) {
            userDetails.append("Contact Email: ").append(profile.getContactEmail()).append(". ");
        }

        // Location
        if (profile != null) {
            if (profile.getCity() != null && !profile.getCity().isBlank()) {
                userDetails.append("City: ").append(profile.getCity()).append(". ");
            }
            if (profile.getState() != null && !profile.getState().isBlank()) {
                userDetails.append("State: ").append(profile.getState()).append(". ");
            }
        }

        // Experience Level
        if (profile != null && profile.getExperienceLevel() != null) {
            userDetails.append("Freelancer Experience Level: ")
                    .append(profile.getExperienceLevel().name())
                    .append(". ");
        }

        // Availability
        if (profile != null && profile.getAvailability() != null) {
            userDetails.append("Availability: ")
                    .append(profile.getAvailability().name())
                    .append(". ");
        }

        // Skills
        if (profile != null && profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            Set<Tag> skills = profile.getSkills();
            String skillList = skills.stream()
                    .map(Tag::name)
                    .collect(Collectors.joining(", "));
            userDetails.append("Skills: ").append(skillList).append(". ");
        }

        // Certifications
        if (profile != null && profile.getCertifications() != null && !profile.getCertifications().isEmpty()) {
            String certList = String.join(", ", profile.getCertifications());
            userDetails.append("Certifications: ").append(certList).append(". ");
        }

        // Languages
        if (profile != null && profile.getLanguagesSpoken() != null && !profile.getLanguagesSpoken().isEmpty()) {
            String langList = String.join(", ", profile.getLanguagesSpoken());
            userDetails.append("Languages Spoken: ").append(langList).append(". ");
        }

        // Current Bio
        if (profile != null && profile.getBio() != null && !profile.getBio().isBlank()) {
            userDetails.append("Current Bio: ").append(profile.getBio()).append(". ");
        }

        // Work Experiences
        if (profile != null && profile.getWorkExperiences() != null && !profile.getWorkExperiences().isEmpty()) {
            userDetails.append("Number of Work Experiences: ")
                    .append(profile.getWorkExperiences().size())
                    .append(". ");
        }

        // Project Experiences
        if (profile != null && profile.getProjectExperiences() != null && !profile.getProjectExperiences().isEmpty()) {
            userDetails.append("Project Experiences Count: ")
                    .append(profile.getProjectExperiences().size())
                    .append(". ");
        }

        // Social Media Links
        if (profile != null && profile.getSocialMediaLinks() != null && !profile.getSocialMediaLinks().isEmpty()) {
            String links = String.join(", ", profile.getSocialMediaLinks());
            userDetails.append("Social Media Links: ").append(links).append(". ");
        }

        return basePrompt + userDetails + userPrompt;
    }

    /**
     * Helper method to append a label and value if the value is non-blank.
     */
    private void appendIfNotBlank(StringBuilder sb, String label, String value) {
        if (value != null && !value.isBlank()) {
            sb.append(label).append(value).append(". ");
        }
    }
}
