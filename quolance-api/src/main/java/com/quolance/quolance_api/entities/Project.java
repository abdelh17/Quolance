package com.quolance.quolance_api.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
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

    @ManyToMany(mappedBy = "projects", cascade = CascadeType.ALL)
    private List<Application> applications;

    @ManyToMany(mappedBy = "projects", cascade = CascadeType.ALL)
    private List<AssociatedTags> associatedTags;

}
