package com.quolance.quolance_api.dtos.project;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

}