package com.quolance.quolance_api.entities;


import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@Table(name = "application")
public class Application extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus applicationStatus = ApplicationStatus.APPLIED;

    @ManyToOne
    @JoinColumn(name = "projectId")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "freelancerId")
    private User freelancer;

    @Version
    private Long version;

    /**
     * Checks if the application is owned by a particular freelancer.
     *
     * @param freelancerId the ID of the client to check ownership for
     * @return true if the application is owned by the freelancer, false otherwise
     */
    public boolean isOwnedBy(Long freelancerId) {
        return freelancer != null && freelancer.getId().equals(freelancerId);
    }
}
