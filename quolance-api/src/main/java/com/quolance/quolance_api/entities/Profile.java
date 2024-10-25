package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "profile")
public class Profile extends AbstractEntity{

    private int rating;

    private String description;

    private String bio;

    private String email;

    @OneToOne(mappedBy = "profile")
    @JoinColumn(name = "userId")
    private User user;

}