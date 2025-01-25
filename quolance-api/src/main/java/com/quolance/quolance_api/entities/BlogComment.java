package com.quolance.quolance_api.entities;

import java.sql.Date;
// import java.util.ArrayList;
// import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "blog_comments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class BlogComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
        
    @Column(nullable = false, length = 1000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "blog_post_id")
    private BlogPost blogPost;

    // @OneToMany(mappedBy = "blogComment", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Reaction> reactions = new ArrayList<>();
}