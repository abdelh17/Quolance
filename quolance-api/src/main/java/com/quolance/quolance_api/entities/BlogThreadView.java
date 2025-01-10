<<<<<<< HEAD
=======
package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "blog_thread_views")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogThreadView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 75)
    private String content;

    @Column(nullable = false)
    private LocalDateTime dateCreated;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "blog_post_id", nullable = false)
    private BlogPost blogPost;

}
>>>>>>> c84386881e4a9b1d8a962cdab5d2a0f48c890c4c
