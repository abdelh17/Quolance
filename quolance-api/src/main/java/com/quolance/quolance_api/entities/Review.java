package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@Table(name = "review")
public class Review extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name = "freelancerId")
    private User freelancer;

    @OneToOne
    @JoinColumn(name = "projectId")
    private Project project;

    @Size(max = 255)
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull(message = "Communication rating is required")
    @Min(value = 0, message = "Communication rating must be at least 0")
    @Max(value = 5, message = "Communication rating must be at most 5")
    @Column(name = "communication_rating", nullable = false)
    private Double communicationRating;

    @NotNull(message = "Quality of work rating is required")
    @Min(value = 0, message = "Quality of work rating must be at least 0")
    @Max(value = 5, message = "Quality of work rating must be at most 5")
    @Column(name = "quality_of_work_rating", nullable = false)
    private Double qualityOfWorkRating;

    @NotNull(message = "Quality of delivery rating is required")
    @Min(value = 0, message = "Quality of delivery rating must be at least 0")
    @Max(value = 5, message = "Quality of delivery rating must be at most 5")
    @Column(name = "quality_of_delivery_rating", nullable = false)
    private Double qualityOfDeliveryRating;

    @Column(name = "overall_rating", nullable = false)
    private Double overallRating;

    @Column(name = "comment", length = 5000)
    @Size(max = 5000, message = "Comment must be less than 5000 characters")
    private String comment;

    @Column(name = "client_first_name", nullable = false)
    private String clientFirstName;

    @Column(name = "client_last_name", nullable = false)
    private String clientLastName;

    @Column(name = "client_username", nullable = false)
    private String clientUsername;


}
