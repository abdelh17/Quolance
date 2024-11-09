package com.quolance.quolance_api.dtos;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Portfolio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioDto {

    @JsonProperty("portfolioId")
    private Long id;
    @JsonProperty("portfolioName")
    private String name;
    @JsonProperty("portfolioItems")
    private List<PortfolioItemDto> portfolioItemsDto; // Names of items in the portfolio
    @JsonProperty("freelancerId")
    private Long freelancerId; // ID of the associated user

       // Converts a PortfolioDTO to a Portfolio entity
       public static Portfolio toEntity(PortfolioDto portfolioDto) {
        return Portfolio.builder()
        .id(portfolioDto.getId())
        .name(portfolioDto.getName())
        .portfolioItems(  portfolioDto.getPortfolioItemsDto().stream()
        .map(PortfolioItemDto::toEntity) // Now correctly returns PortfolioItem
        .collect(Collectors.toList()))
        .build();
    }

    public static PortfolioDto fromEntity(Portfolio portfolio) {
        return PortfolioDto.builder()
        .id(portfolio.getId())
        .name(portfolio.getName())  // Mapping the full User object
        .portfolioItemsDto(portfolio.getPortfolioItems().stream().map(PortfolioItemDto::fromEntity).collect(Collectors.toList()))
        .freelancerId(portfolio.getUser().getId())
        .build();
    }

 
}
