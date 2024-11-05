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
@Table(name = "application",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"projectId", "freelancerId"},
                name = "unique_freelancer_project_application"
        ))
public class Application extends  AbstractEntity{

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @ManyToOne
    @JoinColumn(name = "projectId")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "freelancerId")
    private User freelancer;
}
