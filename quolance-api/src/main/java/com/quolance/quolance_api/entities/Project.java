package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.entities.enums.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

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
    @Enumerated(EnumType.STRING)
    private ProjectCategory category;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private PriceRange priceRange;

    @Enumerated(EnumType.STRING)
    private FreelancerExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    private ExpectedDeliveryTime expectedDeliveryTime;

    private LocalDate deliveryDate;

    private String location;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectStatus projectStatus = ProjectStatus.PENDING;

    private LocalDate expirationDate;

    private LocalDate visibilityExpirationDate;

    @ManyToOne
    private User client;

    @ManyToOne
    private User selectedFreelancer;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Application> applications;

    @ElementCollection(targetClass = Tag.class)
    @CollectionTable(name = "projectTags", joinColumns = @JoinColumn(name = "projectId"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private List<Tag> tags;

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
     * @return true if the project is approved and no freelancer is selected, false otherwise
     */
    public boolean isProjectApproved() {
        return this.projectStatus == ProjectStatus.OPEN;
    }

}
