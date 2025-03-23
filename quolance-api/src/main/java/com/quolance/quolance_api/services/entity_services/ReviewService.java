package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.entities.Review;

import java.util.List;
import java.util.UUID;

public interface ReviewService {

    void saveReview(Review review);

    void deleteReview(Review review);

    Review getReviewById(UUID reviewId);

    Review getReviewByProjectId(UUID projectId);

    List<Review> getAllReviewsByFreelancerId(UUID freelancerId);
}
