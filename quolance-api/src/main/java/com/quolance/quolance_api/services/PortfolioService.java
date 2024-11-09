package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.entities.Portfolio;

import java.util.List;

public interface PortfolioService {

    PortfolioDto createPortfolio(Portfolio portfolio);
    PortfolioDto updatePortfolio(Long id, PortfolioDto portfolioDTO);
    void deletePortfolio(Long id);
    List<PortfolioDto> getAllPortfolios();
    List<PortfolioDto> getPortfolioByFreelancerId(long userId);
    PortfolioDto getPortfolioByUserId (long userId);
}
