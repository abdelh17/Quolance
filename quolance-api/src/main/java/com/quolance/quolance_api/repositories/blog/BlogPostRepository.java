package com.quolance.quolance_api.repositories.blog;

import com.quolance.quolance_api.entities.blog.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    List<BlogPost> findByUserId(UUID userId);

    Page<BlogPost> findAllByOrderByLastModifiedDesc(Pageable pageable);

    @Query("SELECT b FROM BlogPost b " +
            "JOIN b.tags t " +
            "WHERE (:title IS NULL OR LOWER(CAST(b.title AS string)) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%'))) " +
            "AND (:content IS NULL OR LOWER(CAST(b.content AS string)) LIKE LOWER(CONCAT('%', CAST(:content AS string), '%'))) " +
            "AND (cast(:startDate as date) IS NULL OR b.creationDate >= :startDate) " +
            "AND (cast(:tags as string) IS NULL OR (SELECT COUNT(t2) FROM BlogPost b2 JOIN b2.tags t2 WHERE b2.id = b.id AND t2 IN :tags) = CAST(:tagCount AS int))" +
            "GROUP BY b.id " +
            "ORDER BY b.creationDate DESC")
    Page<BlogPost> findFilteredPosts(
            @Param("title") String title,
            @Param("content") String content,
            @Param("startDate") LocalDateTime startDate,
            @Param("tags") List<String> tags,
            @Param("tagCount") Integer tagCount,
            Pageable pageable
    );

    @Query("SELECT b FROM BlogPost b WHERE b.isReported = true AND b.isResolved = false")
    Page<BlogPost> findReportedPosts(Pageable pageable);

    @Query("SELECT b FROM BlogPost b WHERE b.isReported = true AND b.isResolved = true")
    Page<BlogPost> findPreviouslyResolvedPosts(Pageable pageable);

}
