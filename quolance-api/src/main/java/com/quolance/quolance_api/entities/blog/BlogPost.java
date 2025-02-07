package com.quolance.quolance_api.entities.blog;

import com.quolance.quolance_api.entities.AbstractEntity;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.BlogTags;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BlogPost extends AbstractEntity {

    @Column(length = 100)
    private String title;

    @Column(nullable = false, length = 10000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlogComment> blogComments = new ArrayList<>();

    @OneToMany(mappedBy = "blogPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reaction> reactions = new ArrayList<>();


    @ElementCollection(targetClass = BlogTags.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private Set<BlogTags> tags;

    // New addition: Store image paths directly
    @ElementCollection
    @CollectionTable(name = "blog_post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_path")
    private List<String> imagePaths = new ArrayList<>();

}