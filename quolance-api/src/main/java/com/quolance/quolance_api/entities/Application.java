package com.quolance.quolance_api.entities;


import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import java.util.UUID;


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

    @Length(max = 5000)
    @Column(length = 5000)
    private String message;

    
    /**
     * Checks if the application is owned by a particular freelancer.
     *
     * @param freelancerId the ID of the client to check ownership for
     * @return true if the application is owned by the freelancer, false otherwise
     */
    public boolean isOwnedBy(UUID freelancerId) {
        return freelancer != null && freelancer.getId().equals(freelancerId);
    }
}
