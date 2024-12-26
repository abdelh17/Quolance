package com.quolance.quolance_api.entities;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "blog_thread_view_id", nullable = false)
    private BlogThreadView blogThreadView;

    @SuppressWarnings("unchecked")
    public static List<Tag> getTags(BlogThreadView blogThreadView) {
        return (List<Tag>) blogThreadView.getTags();
    }
}