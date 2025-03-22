package com.quolance.quolance_api.dtos.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.Review;
import com.quolance.quolance_api.entities.User;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ReviewCreateDto {

    @JsonProperty("projectId")
    @NotNull(message = "Project ID is required")
    private UUID projectId;

    @Size(max = 255, message = "Title must be less than 255 characters")
    @NotNull(message = "Title is required")
    private String title;

    @NotNull(message = "Communication rating is required")
    @Min(value = 0, message = "Communication rating must be at least 0")
    @Max(value = 5, message = "Communication rating must be at most 5")
    private Double communicationRating;

    @NotNull(message = "Quality of work rating is required")
    @Min(value = 0, message = "Quality of work rating must be at least 0")
    @Max(value = 5, message = "Quality of work rating must be at most 5")
    private Double qualityOfWorkRating;

    @NotNull(message = "Quality of delivery rating is required")
    @Min(value = 0, message = "Quality of delivery rating must be at least 0")
    @Max(value = 5, message = "Quality of delivery rating must be at most 5")
    private Double qualityOfDeliveryRating;

    @Size(max = 1000, message = "Comment must be less than 1000 characters")
    private String comment;

//    @NotNull(message = "Client first name is required")
//    private String clientFirstName;
//
//    @NotNull(message = "Client last name is required")
//    private String clientLastName;
//
//    @NotNull(message = "Client username is required")
//    private String clientUsername;

    public static Review toEntity(ReviewCreateDto reviewCreateDto, Project project, User reviewedFreelancer) {
        return Review.builder()
                .project(project)
                .freelancer(reviewedFreelancer)
                .title(reviewCreateDto.getTitle())
                .communicationRating(reviewCreateDto.getCommunicationRating())
                .qualityOfWorkRating(reviewCreateDto.getQualityOfWorkRating())
                .qualityOfDeliveryRating(reviewCreateDto.getQualityOfDeliveryRating())
                .overallRating(calculateOverallRating(reviewCreateDto))
                .comment(reviewCreateDto.getComment())
                .clientFirstName(project.getClient().getFirstName())
                .clientLastName(project.getClient().getLastName())
                .clientUsername(project.getClient().getUsername())
                .build();
    }

    private static Double calculateOverallRating(ReviewCreateDto reviewCreateDto) {
        double average = (reviewCreateDto.getCommunicationRating() +
                         reviewCreateDto.getQualityOfWorkRating() +
                         reviewCreateDto.getQualityOfDeliveryRating()) / 3.0;

        // Round to the nearest 0.5
        double roundedAverage = Math.round(average * 2) / 2.0;

        return roundedAverage;
    }
}
