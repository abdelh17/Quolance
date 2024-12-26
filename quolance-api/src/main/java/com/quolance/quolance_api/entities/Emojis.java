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
@Table(name = "emojis")
public class Emojis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String emojiCode;

    @ManyToOne
    @JoinColumn(name = "reaction_id", nullable = false)
    private Reactions reaction;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}