package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.entities.Review;
import com.quolance.quolance_api.repositories.ReviewRepository;
import com.quolance.quolance_api.services.entity_services.ReviewService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.resource.ResourceUrlEncodingFilter;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Override
    public void saveReview(Review review) {
        reviewRepository.save(review);
        log.info("Successfully saved review with ID: {} for user with ID {}", review.getId(), review.getFreelancer().getId());
    }

    @Override
    public void deleteReview(Review review) {
        reviewRepository.delete(review);
        log.info("Successfully deleted review with ID: {}", review.getId());
    }

    @Override
    public Review getReviewById(UUID reviewId) {
        log.debug("Fetching review with ID: {}", reviewId);
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> {
            log.warn("No review found with ID: {}", reviewId);
            return ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("No Review found with ID: " + reviewId)
                    .build();
        });
        return review;
    }

    @Override
    public Review getReviewByProjectId(UUID projectId) {
        return reviewRepository.findReviewByProjectId(projectId);
    }

    @Override
    public List<Review> getAllReviewsByFreelancerId(UUID freelancerId) {
        return reviewRepository.findReviewsByFreelancerId(freelancerId);
    }
}
