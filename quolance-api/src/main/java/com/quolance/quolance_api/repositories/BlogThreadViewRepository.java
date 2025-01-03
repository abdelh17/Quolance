package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.BlogThreadView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogThreadViewRepository extends JpaRepository<BlogThreadView, Long> {
    Optional<BlogThreadView> findByBlogPostId(Long blogPostId);
}