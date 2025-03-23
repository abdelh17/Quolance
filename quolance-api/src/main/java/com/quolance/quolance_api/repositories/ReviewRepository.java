package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findReviewsByFreelancerId(UUID freelancerId);

    Review findReviewByProjectId(UUID projectId);

    Application findApplicationByFreelancerIdAndProjectId(UUID freelancerId, UUID projectId);
}
