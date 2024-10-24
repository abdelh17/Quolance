package com.quolance.quolance_api.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "application")
public class Application extends  AbstractEntity{

    private String status;

    // Many-to-one with Project (side of the many-to-many)
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    // Many-to-one with Freelancer (side of the many-to-many)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
