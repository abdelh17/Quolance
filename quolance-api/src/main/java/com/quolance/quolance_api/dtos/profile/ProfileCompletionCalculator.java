package com.quolance.quolance_api.dtos.profile;

import com.quolance.quolance_api.entities.enums.ProfileField;
import org.springframework.stereotype.Component;

@Component
public class ProfileCompletionCalculator {

    public int calculateCompletion(FreelancerProfileDto profile) {
        int totalWeight = 0;
        int completedWeight = 0;

        for (ProfileField field : ProfileField.values()) {

            totalWeight += field.getWeight();
            if (isFieldCompleted(profile, field)) {
                completedWeight += field.getWeight();
            }
        }

        return (completedWeight * 100) / totalWeight;
    }

    private boolean isFieldCompleted(FreelancerProfileDto profile, ProfileField field) {
        switch (field) {
            case FIRST_NAME:
                return profile.getFirstName() != null && !profile.getFirstName().isEmpty();
            case LAST_NAME:
                return profile.getLastName() != null && !profile.getLastName().isEmpty();
            case PROFILE_IMAGE:
                return profile.getProfileImageUrl() != null && !profile.getProfileImageUrl().isEmpty();
            case BIO:
                return profile.getBio() != null && !profile.getBio().isEmpty();
            case CONTACT_EMAIL:
                return profile.getContactEmail() != null && !profile.getContactEmail().isEmpty();
            case CITY:
                return profile.getCity() != null && !profile.getCity().isEmpty();
            case STATE:
                return profile.getState() != null && !profile.getState().isEmpty();
            case EXPERIENCE_LEVEL:
                return profile.getExperienceLevel() != null;
            case SOCIAL_MEDIA_LINKS:
                return profile.getSocialMediaLinks() != null && !profile.getSocialMediaLinks().isEmpty();
            case SKILLS:
                return profile.getSkills() != null && !profile.getSkills().isEmpty();
            case AVAILABILITY:
                return profile.getAvailability() != null;
            case LANGUAGES_SPOKEN:
                return profile.getLanguagesSpoken() != null && !profile.getLanguagesSpoken().isEmpty();
            case PROJECT_EXPERIENCES:
                return profile.getProjectExperiences() != null && !profile.getProjectExperiences().isEmpty();
            case WORK_EXPERIENCES:
                return profile.getWorkExperiences() != null && !profile.getWorkExperiences().isEmpty();
            default:
                return false;
        }
    }
}
