package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "project")
@Entity
@Getter
@Setter
public class Project extends AbstractEntity{

    private String description;

    private String status;

    @ManyToOne
    private User client;

    @ManyToMany(mappedBy = "projects", cascade = CascadeType.ALL)
    private List<Application> applications;

    @ManyToMany(mappedBy = "projects", cascade = CascadeType.ALL)
    private List<Tag> tags;

}
