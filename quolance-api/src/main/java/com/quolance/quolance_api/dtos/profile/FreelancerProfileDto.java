package com.quolance.quolance_api.dtos.profile;

import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Availability;
import com.quolance.quolance_api.entities.enums.FreelancerExperienceLevel;
import com.quolance.quolance_api.entities.enums.Tag;
import com.quolance.quolance_api.entities.profile.ProjectExperience;
import com.quolance.quolance_api.entities.profile.WorkExperience;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerProfileDto {

    private UUID id;
    private UUID userId;

    private String firstName;
    private String lastName;
    private String username;
    private String profileImageUrl;

    private String bio;
    private String contactEmail;
    private String city;
    private String state;
    private FreelancerExperienceLevel experienceLevel;
    private Set<String> socialMediaLinks;
    private Set<Tag> skills;
    private Availability availability;
    private List<WorkExperience> workExperiences;
    private Set<String> certifications;
    private Set<String> languagesSpoken;
    private List<ProjectExperience> projectExperiences;

    public static FreelancerProfileDto fromEntity(User user) {
        Profile profile = user.getProfile();
        return FreelancerProfileDto.builder()
                .id(profile.getId())
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(profile.getBio())
                .contactEmail(profile.getContactEmail())
                .city(profile.getCity())
                .state(profile.getState())
                .experienceLevel(profile.getExperienceLevel())
                .socialMediaLinks(profile.getSocialMediaLinks())
                .skills(profile.getSkills())
                .availability(profile.getAvailability())
                .workExperiences(profile.getWorkExperiences())
                .certifications(profile.getCertifications())
                .languagesSpoken(profile.getLanguagesSpoken())
                .projectExperiences(profile.getProjectExperiences())
                .build();
    }
}