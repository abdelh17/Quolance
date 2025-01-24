package com.quolance.quolance_api.repositories.blog;

import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogReactionRepository extends JpaRepository<Reaction, Long> {

    // Find reaction for a specific post by a user
    Optional<Reaction> findByUserAndPost(User user, BlogPost post);

    // Find reaction for a specific reply by a user
    Optional<Reaction> findByUserAndComment(User user, BlogComment comment);

}
