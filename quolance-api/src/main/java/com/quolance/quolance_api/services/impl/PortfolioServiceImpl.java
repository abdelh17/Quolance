package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Portfolio;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.PortfolioRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PortfolioServiceImpl implements PortfolioService {

    
    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    @Autowired
    public PortfolioServiceImpl(PortfolioRepository portfolioRepository, UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
    }

    
    @Override
    public PortfolioDto createPortfolio(Portfolio portfolio) {
        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return PortfolioDto.fromEntity(savedPortfolio);
    }


    @Override
    public PortfolioDto updatePortfolio(Long id, PortfolioDto portfolioDto) {
        Portfolio portfolio = portfolioRepository.findById(id).orElseThrow(() -> 
            new IllegalArgumentException("Portfolio not found with ID: " + id));
        User freelancer = userRepository.findById(portfolioDto.getId()).orElseThrow(() -> 
            new IllegalArgumentException("User not found with ID: " + portfolioDto.getId()));
        portfolio.setName(portfolioDto.getName());
        portfolio.setUser(freelancer);
        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return PortfolioDto.fromEntity(updatedPortfolio);
    }

    @Override
    public void deletePortfolio(Long id) {
        portfolioRepository.deleteById(id);
    }

    @Override
    public List<PortfolioDto> getAllPortfolios() {
        List<Portfolio> portfolio = portfolioRepository.findAll();
        return portfolio.stream().map(PortfolioDto::fromEntity).toList();
    }

    @Override
    public List<PortfolioDto> getPortfolioByFreelancerId(long userId) {
        return portfolioRepository.findById(userId).stream()
        .map(PortfolioDto::fromEntity)
        .toList();
    }

    @Override
    public PortfolioDto getPortfolioByUserId(long userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
        .orElseThrow(() -> new IllegalArgumentException("Portfolio not found for user with ID: " + userId));
    
    return PortfolioDto.fromEntity(portfolio);
    }
}
