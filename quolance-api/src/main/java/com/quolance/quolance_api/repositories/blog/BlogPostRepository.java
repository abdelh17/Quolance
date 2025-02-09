package com.quolance.quolance_api.repositories.blog;

import com.quolance.quolance_api.entities.blog.BlogPost;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByUserId(Long userId);

    Page<BlogPost> findAll(Pageable pageable);
}
