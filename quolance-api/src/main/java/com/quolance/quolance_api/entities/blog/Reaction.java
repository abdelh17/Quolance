package com.quolance.quolance_api.entities.blog;

import com.quolance.quolance_api.entities.AbstractEntity;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ReactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "blog_reactions")
public class Reaction extends AbstractEntity {


    @ManyToOne
    @JoinColumn(name = "blog_post_id")
    private BlogPost blogPost;

    @ManyToOne
    @JoinColumn(name = "blog_comment_id")
    private BlogComment blogComment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReactionType reactionType; 


}
