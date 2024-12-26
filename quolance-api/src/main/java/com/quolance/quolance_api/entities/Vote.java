package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Table(name = "votes")
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private boolean upvote;

    @ManyToOne
    @JoinColumn(name = "reaction_id", nullable = false)
    private Reactions reaction;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}