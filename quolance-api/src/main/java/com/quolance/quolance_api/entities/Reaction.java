package com.quolance.quolance_api.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.quolance.quolance_api.entities.enums.ReactionTypeConstants;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    private BlogPost blogPost; // Nullable, set only for post reactions

    @ManyToOne
    @JoinColumn(name = "blog_comment_id")
    private BlogComment blogComment; // Nullable, set only for comment reactions

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING) // Ensure that the enum is stored as a string in the database
    @Column(nullable = false)
    private ReactionTypeConstants reactionType; 


}
