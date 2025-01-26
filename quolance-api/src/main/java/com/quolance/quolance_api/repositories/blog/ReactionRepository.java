package com.quolance.quolance_api.repositories.blog;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndBlogPost(User user, BlogPost blogPost);

    Optional<Reaction> findByUserAndBlogComment(User user, BlogComment blogComment);

    List<Reaction> findByBlogPost(BlogPost blogPost);

    List<Reaction> findByBlogComment(BlogComment blogComment);
}
