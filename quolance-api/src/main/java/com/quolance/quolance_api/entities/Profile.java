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

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<SocialMedia> socialMedia;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<Images> images;

    @OneToOne(mappedBy = "profile")
    private User user;


    public int getRating() {
        return rating;
    }

    public String getDescription() {
        return description;
    }

    public String getBio() {
        return bio;
    }

    public String getEmail() {
        return email;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}