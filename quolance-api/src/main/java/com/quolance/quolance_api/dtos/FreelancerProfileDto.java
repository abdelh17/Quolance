package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Availability;
import com.quolance.quolance_api.entities.enums.FreelancerExperienceLevel;
import com.quolance.quolance_api.entities.enums.SalaryRange;
import com.quolance.quolance_api.entities.enums.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerProfileDto {

    private Long id;
    private Long userId;

    private String firstName;
    private String lastName;
    private String profileImageUrl;

    private String bio;
    private String contactEmail;
    private String city;
    private String state;
    private FreelancerExperienceLevel experienceLevel;
    private Set<String> socialMediaLinks;
    private Set<Tag> skills;
    private Availability availability;
    private SalaryRange askingSalary;

    public static FreelancerProfileDto fromEntity(User user) {
        Profile profile = user.getProfile();
        return FreelancerProfileDto.builder()
                .id(profile.getId())
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profileImageUrl(user.getProfileImageUrl())
                .bio(profile.getBio())
                .contactEmail(profile.getContactEmail())
                .city(profile.getCity())
                .state(profile.getState())
                .experienceLevel(profile.getExperienceLevel())
                .socialMediaLinks(profile.getSocialMediaLinks())
                .skills(profile.getSkills())
                .availability(profile.getAvailability())
                .askingSalary(profile.getAskingSalary())
                .build();
    }
}