package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.entities.Portfolio;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.PortfolioRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.PortfolioService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    @Override
    public PortfolioDto createPortfolio(PortfolioDto portfolioDto, User freelancer) {
        Portfolio portfolioToSave = PortfolioDto.toEntity(portfolioDto);
        portfolioToSave.setUser(freelancer);
        Portfolio savedPortfolio = portfolioRepository.save(portfolioToSave);
        return PortfolioDto.fromEntity(savedPortfolio);
    }

    @Override
    public PortfolioDto updatePortfolio(Long id, PortfolioDto portfolioDto) {
        Portfolio portfolio = portfolioRepository.findById(id).orElseThrow(() -> new ApiException("Portfolio not found with ID: " + id));
        User freelancer = userRepository.findById(portfolioDto.getId()).orElseThrow(() -> new ApiException("User not found with ID: " + portfolioDto.getId()));
        portfolio.setName(portfolioDto.getName());
        portfolio.setUser(freelancer);
        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return PortfolioDto.fromEntity(updatedPortfolio);
    }

    @Override
    public List<PortfolioDto> getPortfolioByFreelancerId(long userId) {
        return portfolioRepository.findById(userId).stream().map(PortfolioDto::fromEntity).toList();
    }

    @Override
    public PortfolioDto getPortfolioByUserId(long userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId).orElseThrow(() -> new ApiException("No portfolio found for this user."));
        return PortfolioDto.fromEntity(portfolio);
    }

    @Override
    public void deletePortfolioByFreelancerId(Long freelancerId) {
        PortfolioDto portfolio = getPortfolioByUserId(freelancerId);
        if (portfolio != null) {
            portfolioRepository.deleteById(portfolio.getId());
        }
    }
}
