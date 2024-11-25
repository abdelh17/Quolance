package com.quolance.quolance_api.dtos.project;

import com.quolance.quolance_api.entities.enums.ExpectedDeliveryTime;
import com.quolance.quolance_api.entities.enums.FreelancerExperienceLevel;
import com.quolance.quolance_api.entities.enums.PriceRange;
import com.quolance.quolance_api.entities.enums.ProjectCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectUpdateDto {

    private String title;
    private String description;
    private ProjectCategory category;
    private PriceRange priceRange;
    private ExpectedDeliveryTime expectedDeliveryTime;
    private FreelancerExperienceLevel experienceLevel;

}