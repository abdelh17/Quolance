package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BlogPost extends AbstractEntity {

    @Column(nullable = true, length = 100)
    private String title;

    @Column(nullable = false, length = 10000) // Ensures content has a size limit
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlogComment> blogComments = new ArrayList<>(); // Initialize as an empty list

    // Placeholder relationships (null templates for now)
//    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Reaction> reactions = new ArrayList<>();

//    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Reply> replies = new ArrayList<>();

}