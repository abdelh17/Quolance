package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.entities.User;

import java.util.List;

public interface PortfolioService {

    PortfolioDto createPortfolio(PortfolioDto portfolioDto, User freelancer);

    PortfolioDto updatePortfolio(Long id, PortfolioDto portfolioDTO);

    List<PortfolioDto> getPortfolioByFreelancerId(long userId);

    PortfolioDto getPortfolioByUserId(long userId);

    void deletePortfolioByFreelancerId(Long freelancerId);
}
