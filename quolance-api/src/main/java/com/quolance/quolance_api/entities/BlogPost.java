package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BlogPost extends AbstractEntity {

    @Column(nullable = false, length = 10000) // Ensures content has a size limit
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Placeholder relationships (null templates for now)
//    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Reaction> reactions = new ArrayList<>();

//    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Reply> replies = new ArrayList<>();

}