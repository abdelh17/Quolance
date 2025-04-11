package com.quolance.quolance_api.unit.services.entity_services;

import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.Review;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.repositories.ReviewRepository;
import com.quolance.quolance_api.services.entity_services.impl.ReviewServiceImpl;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceUnitTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private Review mockReview;
    private UUID reviewId;

    @BeforeEach
    void setUp() {
        reviewRepository.deleteAll();
        reviewId = UUID.randomUUID();
        User projectOwner = EntityCreationHelper.createClient();
        User reviewer = EntityCreationHelper.createFreelancer(1);
        Project project = EntityCreationHelper.createProject(ProjectStatus.CLOSED, projectOwner);
        mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setComment("Test review content");
        mockReview.setProject(project);
        mockReview.setFreelancer(reviewer);
    }

    @Test
    void getReviewById_ShouldThrowException_WhenReviewNotFound() {
        when(reviewRepository.findById(reviewId)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> reviewService.getReviewById(reviewId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("No Review found with ID: " + reviewId);
    }

    @Test
    void saveReview_ShouldSaveReview_WhenValidReview() {
        when(reviewRepository.save(mockReview)).thenReturn(mockReview);

        reviewService.saveReview(mockReview);

        verify(reviewRepository).save(mockReview);
    }

    @Test
    void deleteReview_ShouldDeleteReview_WhenValidReview() {
        doNothing().when(reviewRepository).delete(mockReview);

        reviewService.deleteReview(mockReview);

        verify(reviewRepository).delete(mockReview);
    }

    @Test
    void getAllReviewsByFreelancerId_ShouldReturnEmptyList_WhenNoReviewsFound() {
        UUID freelancerId = UUID.randomUUID();
        when(reviewRepository.findReviewsByFreelancerId(freelancerId)).thenReturn(java.util.Collections.emptyList());

        var result = reviewService.getAllReviewsByFreelancerId(freelancerId);

        assertThat(result).isEmpty();
        verify(reviewRepository).findReviewsByFreelancerId(freelancerId);
    }

    @Test
    void getReviewByProjectId_ShouldReturnReview_WhenReviewExists() {
        UUID projectId = UUID.randomUUID();
        when(reviewRepository.findReviewByProjectId(projectId)).thenReturn(mockReview);

        Review result = reviewService.getReviewByProjectId(projectId);

        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(mockReview);
        verify(reviewRepository).findReviewByProjectId(projectId);
    }

    @Test
    void getAllReviewsByFreelancerId_ShouldReturnReviews_WhenReviewsExist() {
        UUID freelancerId = UUID.randomUUID();
        List<Review> reviews = List.of(mockReview);
        when(reviewRepository.findReviewsByFreelancerId(freelancerId)).thenReturn(reviews);

        var result = reviewService.getAllReviewsByFreelancerId(freelancerId);

        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(mockReview);
        verify(reviewRepository).findReviewsByFreelancerId(freelancerId);
    }

    @Test
    void deleteReview_ShouldThrowException_WhenReviewDoesNotExist() {
        doThrow(new EntityNotFoundException("Review not found")).when(reviewRepository).delete(mockReview);

        assertThatThrownBy(() -> reviewService.deleteReview(mockReview))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Review not found");
    }


}