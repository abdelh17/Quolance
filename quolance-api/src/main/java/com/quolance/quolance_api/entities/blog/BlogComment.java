package com.quolance.quolance_api.entities.blog;

import com.quolance.quolance_api.entities.AbstractEntity;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.BlogReactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "blog_comments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class BlogComment extends AbstractEntity {
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

    // Reaction counts map
    @ElementCollection
    @CollectionTable(name = "comment_reaction_counts", joinColumns = @JoinColumn(name = "comment_id"))
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "reaction_type")
    @Column(name = "reaction_count")
    private Map<BlogReactionType, Long> reactionCounts = new HashMap<>();
}