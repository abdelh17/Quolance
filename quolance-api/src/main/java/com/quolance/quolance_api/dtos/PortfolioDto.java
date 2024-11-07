package com.quolance.quolance_api.dtos;
import java.util.List;
import java.util.stream.Collectors;
import com.quolance.quolance_api.entities.Portfolio;
import com.quolance.quolance_api.entities.PortfolioItem;
import com.quolance.quolance_api.entities.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioDto {
    private Long id;
    private String name;
    private List<String> portfolioItems; // Names of items in the portfolio
    private Long userId; // ID of the associated user

    public static PortfolioDto fromEntity(Portfolio portfolio) {
        PortfolioDto dto = new PortfolioDto();
        dto.setId(portfolio.getId());
        dto.setName(portfolio.getName());
        dto.setPortfolioItems(
            portfolio.getPortfolioItems() != null
                ? portfolio.getPortfolioItems().stream().map(PortfolioItem::getName).collect(Collectors.toList())
                : null
        );
        dto.setUserId(portfolio.getUser() != null ? portfolio.getUser().getId() : null);
        return dto;
    }

    // Converts a PortfolioDTO to a Portfolio entity
    public Portfolio toEntity(User user) {
        Portfolio portfolio = new Portfolio();
        portfolio.setId(this.id);
        portfolio.setName(this.name);
        portfolio.setUser(user);
        return portfolio;
    }

}
