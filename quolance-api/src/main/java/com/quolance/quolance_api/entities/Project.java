package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.entities.enums.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Table(name = "project")
public class Project extends AbstractEntity {

    private String title;

    @Length(max = 5000) //This is in the API level, before the data is sent to the DB (Verification)
    @Column(length = 5000) // This is in the DB level

    private String description;

    private LocalDate expirationDate;

    private LocalDate visibilityExpirationDate;

    @Enumerated(EnumType.STRING)
    private ProjectCategory category;

    @Enumerated(EnumType.STRING)
    private PriceRange priceRange;

    @Enumerated(EnumType.STRING)
    private FreelancerExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    private ExpectedDeliveryTime expectedDeliveryTime;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectStatus projectStatus = ProjectStatus.PENDING;

    @ElementCollection(targetClass = Tag.class)
    @CollectionTable(name = "projectTags", joinColumns = @JoinColumn(name = "projectId"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private List<Tag> tags;

    @ManyToOne
    private User client;

    @ManyToOne
    private User selectedFreelancer;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications;


    @Version
    private Long version;

    /**
     * Checks if the project is owned by a particular client.
     *
     * @param clientId the ID of the client to check ownership for
     * @return true if the project is owned by the client, false otherwise
     */
    public boolean isOwnedBy(Long clientId) {
        return client != null && client.getId().equals(clientId);
    }

    /**
     * Checks if the project is in a state that allows selecting a freelancer.
     *
     * @return true if the project is approved, false otherwise
     */
    public boolean isProjectApproved() {
        return this.projectStatus == ProjectStatus.OPEN;
    }

    /**
     * Checks if a freelancer has already been selected for this project.
     *
     * @return true if a freelancer has been selected, false otherwise
     */
    public boolean hasSelectedFreelancer() {
        return this.selectedFreelancer != null;
    }

    /**
     * Gets the owner of the project.
     *
     * @return the User who owns the project, or null if no owner is assigned.
     */
    public User getOwner() {
        return this.client;
    }

}
