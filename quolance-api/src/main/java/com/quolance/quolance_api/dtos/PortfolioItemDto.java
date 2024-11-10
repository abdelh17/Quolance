package com.quolance.quolance_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.PortfolioItem;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
public class PortfolioItemDto {
    @JsonProperty("portfolioItemId")
    private Long id;

    @JsonProperty("portfolioItemName")
    private String name;

    public static PortfolioItem toEntity(PortfolioItemDto portfolioItemDto) {
        return PortfolioItem.builder()
                .name(portfolioItemDto.getName())
                .build();
    }

    public static PortfolioItemDto fromEntity(PortfolioItem portfolioItem) {
        return PortfolioItemDto.builder()
                .id(portfolioItem.getId())
                .name(portfolioItem.getName())
                .build();
    }
}
