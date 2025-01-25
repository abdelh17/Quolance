package com.quolance.quolance_api.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quolance.quolance_api.entities.BlogComment;
import com.quolance.quolance_api.entities.BlogPost;
import com.quolance.quolance_api.entities.Reaction;
import com.quolance.quolance_api.entities.User;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByBlogPostId(Long blogPostId);

    Optional<Reaction> findByBlogPostIdAndUserId(Long blogPostId, Long userId);

    List<Reaction> findByBlogPost(BlogComment blogComment);

    Optional<Reaction> findByUserAndBlogPost(User user, BlogPost blogPost);

        // Find reactions by BlogPost
        List<Reaction> findByBlogPost(BlogPost blogPost);

        // Find reactions by BlogComment
        List<Reaction> findByBlogComment(BlogComment blogComment);
}
