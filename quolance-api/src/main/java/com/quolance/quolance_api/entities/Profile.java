package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.entities.enums.Availability;
import com.quolance.quolance_api.entities.enums.FreelancerExperienceLevel;
import com.quolance.quolance_api.entities.enums.Tag;
import com.quolance.quolance_api.entities.profile.ProjectExperience;
import com.quolance.quolance_api.entities.profile.WorkExperience;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "profile")
public class Profile extends AbstractEntity {


    @Length(max = 5000)
    @Column(length = 5000)
    private String bio;

    private String contactEmail;

    private String city;

    private String state;

    @Enumerated(EnumType.STRING)
    private FreelancerExperienceLevel experienceLevel;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "social_media_links", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "link")
    private Set<String> socialMediaLinks;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skills", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "skill")
    private Set<Tag> skills;

    @Enumerated(EnumType.STRING)
    private Availability availability;

    @OneToOne(mappedBy = "profile")
    @JoinColumn(name = "userId")
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "profile_id")
    private List<WorkExperience> workExperiences;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "certifications", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "certification")
    private Set<String> certifications;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "languagesSpoken", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "language")
    private Set<String> languagesSpoken;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "profile_id")
    private List<ProjectExperience> projectExperiences;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @Column(name = "embedding_json", columnDefinition = "TEXT")
    private String embeddingJson;
}