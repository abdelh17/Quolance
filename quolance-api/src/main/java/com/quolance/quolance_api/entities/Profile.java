package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.entities.enums.Availability;
import com.quolance.quolance_api.entities.enums.FreelancerExperienceLevel;
import com.quolance.quolance_api.entities.enums.SalaryRange;
import com.quolance.quolance_api.entities.enums.Tag;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "profile")
public class Profile extends AbstractEntity {

    private String bio;

    private String contactEmail;

    private String city;

    private String state;

    @Enumerated(EnumType.STRING)
    private FreelancerExperienceLevel experienceLevel;

    @ElementCollection
    @CollectionTable(name = "social_media_links", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "link")
    private Set<String> socialMediaLinks;

    @ElementCollection
    @CollectionTable(name = "skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private Set<Tag> skills;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    @Enumerated(EnumType.STRING)
    private SalaryRange askingSalary;

    @OneToOne(mappedBy = "profile")
    @JoinColumn(name = "userId")
    private User user;
}