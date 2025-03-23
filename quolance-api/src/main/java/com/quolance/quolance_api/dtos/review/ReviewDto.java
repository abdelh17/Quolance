package com.quolance.quolance_api.dtos.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Review;
import com.quolance.quolance_api.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDto {

    @JsonProperty("title")
    private String title;

    @JsonProperty("communicationRating")
    private Double communicationRating;

    @JsonProperty("qualityOfWorkRating")
    private Double qualityOfWorkRating;

    @JsonProperty("qualityOfDeliveryRating")
    private Double qualityOfDeliveryRating;

    @JsonProperty("overallRating")
    private Double overallRating;

    @JsonProperty("comment")
    private String comment;

    @JsonProperty("clientFirstName")
    private String clientFirstName;

    @JsonProperty("clientLastName")
    private String clientLastName;

    @JsonProperty("clientUsername")
    private String clientUsername;

    // Static method to convert from entity to DTO
    public static ReviewDto fromEntity(Review review) {
        return ReviewDto.builder()
                .title(review.getTitle())
                .communicationRating(review.getCommunicationRating())
                .qualityOfWorkRating(review.getQualityOfWorkRating())
                .qualityOfDeliveryRating(review.getQualityOfDeliveryRating())
                .overallRating(review.getOverallRating())
                .comment(review.getComment())
                .clientFirstName(review.getClientFirstName())
                .clientLastName(review.getClientLastName())
                .clientUsername(review.getClientUsername())
                .build();
    }
}
