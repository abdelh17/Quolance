package com.quolance.quolance_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.Portfolio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;


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
    private List<PortfolioItemDto> portfolioItemsDto;
    @JsonProperty("freelancerId")
    private Long freelancerId;

    public static Portfolio toEntity(PortfolioDto portfolioDto) {
        return Portfolio.builder()
                .name(portfolioDto.getName())
                .portfolioItems(portfolioDto.getPortfolioItemsDto().stream()
                        .map(PortfolioItemDto::toEntity)
                        .collect(Collectors.toList()))
                .build();
    }

    public static PortfolioDto fromEntity(Portfolio portfolio) {
        return PortfolioDto.builder()
                .id(portfolio.getId())
                .name(portfolio.getName())
                .portfolioItemsDto(portfolio.getPortfolioItems().stream().map(PortfolioItemDto::fromEntity).collect(Collectors.toList()))
                .freelancerId(portfolio.getUser().getId())
                .build();
    }


}
