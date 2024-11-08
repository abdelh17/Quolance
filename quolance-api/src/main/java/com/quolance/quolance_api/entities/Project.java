package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.entities.enums.Tag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Table(name = "project")
public class Project extends AbstractEntity {

    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectStatus projectStatus = ProjectStatus.PENDING;

    @ManyToOne
    private User client;

    @ManyToOne
    private User selectedFreelancer;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true) // TODO: Check if orphanRemoval is necessary, consider not deleting entities
    private List<Application> applications;

    @ElementCollection(targetClass = Tag.class)
    @CollectionTable(name = "projectTags", joinColumns = @JoinColumn(name = "projectId"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private List<Tag> tags;

    @Version
    private Long version;

}
