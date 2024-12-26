package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Entity
@NoArgsConstructor
@Table(name = "blog_thread_views")
public class BlogThreadView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // @OneToOne
    // @JoinColumn(name = "blogpost_id", nullable = false)
    // private BlogPost blogPost;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "blog_thread_view_id")
    private Set<Tag> tags;
}