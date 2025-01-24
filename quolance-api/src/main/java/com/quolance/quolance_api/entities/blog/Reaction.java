package com.quolance.quolance_api.entities.blog;

import com.quolance.quolance_api.entities.AbstractEntity;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.BlogReactionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "reactions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "post_id"}),
        @UniqueConstraint(columnNames = {"user_id", "comment_id"})
})
@Data
@SuperBuilder
@NoArgsConstructor
public class Reaction extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BlogReactionType reactionType;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private BlogPost post;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private BlogComment comment;
}