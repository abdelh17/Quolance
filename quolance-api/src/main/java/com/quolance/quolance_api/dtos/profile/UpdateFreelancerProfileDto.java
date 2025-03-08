package com.quolance.quolance_api.dtos.profile;

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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFreelancerProfileDto {
    private String firstName;
    private String lastName;
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
}