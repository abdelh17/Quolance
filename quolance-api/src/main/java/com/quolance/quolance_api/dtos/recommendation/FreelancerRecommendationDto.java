package com.quolance.quolance_api.dtos.recommendation;

import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerRecommendationDto {
    private FreelancerProfileDto profile;
    private Double similarityScore;
}
