package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.entities.enums.Tag;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "project")
public class Project extends AbstractEntity{

    private String description;

    private String status;

    @ManyToOne
    private User client;

    @OneToMany(mappedBy = "project")
    private List<Application> applications;

    @ElementCollection(targetClass = Tag.class)
    @CollectionTable(name = "projectTags", joinColumns = @JoinColumn(name = "projectId"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private List<Tag> tags;
}
