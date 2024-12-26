package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.dtos.reactionDto;
import com.quolance.quolance_api.entities.enums.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Table(name = "reactions")
public class Reactions {


    private long id;
    private String type;
    private LocalDate createdAt;
    
    @ManyToOne
    private User client;

    // @ManyToOne
    // private BlogPost blogPost;

    // Custom method to display reaction details
    // public String displayReactionDetails() {
    //     return "Reaction [id=" + id + ", type=" + type + ", createdAt=" + createdAt + ", user=" + user.getUsername() + ", blogPost=" + blogPost.getTitle() + "]";
    // }

    public void updateReactionType(String newType) {
        this.type = newType;
    }

    public reactionDto getUser() {
        throw new UnsupportedOperationException("Unimplemented method 'getUser'");
    }

    public Object getBlogPost() {
        throw new UnsupportedOperationException("Unimplemented method 'getBlogPost'");
    }

}



  