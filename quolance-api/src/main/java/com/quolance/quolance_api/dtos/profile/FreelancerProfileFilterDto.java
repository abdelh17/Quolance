package com.quolance.quolance_api.dtos.profile;

import com.quolance.quolance_api.entities.enums.Availability;
import com.quolance.quolance_api.entities.enums.FreelancerExperienceLevel;
import com.quolance.quolance_api.entities.enums.Tag;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
@Getter
@Setter
public class FreelancerProfileFilterDto {
    private String searchName;
    private FreelancerExperienceLevel experienceLevel;
    private Availability availability;
    private Set<Tag> skills;
}
