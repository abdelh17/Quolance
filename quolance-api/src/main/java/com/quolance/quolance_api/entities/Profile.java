package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "profile")
@Entity
@Getter
@Setter
public class Profile extends AbstractEntity{

    private int rating;

    private String description;

    private String bio;

    private String email;

    @OneToOne(mappedBy = "profile")
    private User user;

}