package com.quolance.quolance_api.dtos.project;

import com.quolance.quolance_api.entities.enums.ProjectCategory;
import com.quolance.quolance_api.entities.enums.PriceRange;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectFilterDto {
    private String searchTitle;
    private ProjectCategory category;
    private PriceRange priceRange;
}