package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Table(name = "replies")
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String content;

    @OneToOne
    @JoinColumn(name = "reaction_id", nullable = false)
    private Reactions reaction;

    // @ManyToOne
    // @JoinColumn(name = "blogpost_id", nullable = false)
    // private BlogPost blogPost;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
        name = "reply_replies",
        joinColumns = @JoinColumn(name = "reply_id"),
        inverseJoinColumns = @JoinColumn(name = "related_reply_id")
    )
    private Set<Reply> relatedReplies;

    @ManyToMany(mappedBy = "relatedReplies")
    private Set<Reply> replies;
}