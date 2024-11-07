package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.entities.Portfolio;
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
    public PortfolioDto createPortfolio(PortfolioDto portfolioDto, long userId) {
        User user = userRepository.findById(portfolioDto.getUserId())
    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + portfolioDto.getUserId()));
        Portfolio portfolio = portfolioDto.toEntity(user);
        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return PortfolioDto.fromEntity(savedPortfolio);
    }

    @Override
    public PortfolioDto getPortfolioById(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id).orElseThrow(() -> 
            new IllegalArgumentException("Portfolio not found with ID: " + id));
        return PortfolioDto.fromEntity(portfolio);
    }

    @Override
    public PortfolioDto updatePortfolio(Long id, PortfolioDto portfolioDto) {
        Portfolio portfolio = portfolioRepository.findById(id).orElseThrow(() -> 
            new IllegalArgumentException("Portfolio not found with ID: " + id));
        User user = userRepository.findById(portfolioDto.getUserId()).orElseThrow(() -> 
            new IllegalArgumentException("User not found with ID: " + portfolioDto.getUserId()));
        portfolio.setName(portfolioDto.getName());
        portfolio.setUser(user);
        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return PortfolioDto.fromEntity(updatedPortfolio);
    }

    @Override
    public void deletePortfolio(Long id) {
        portfolioRepository.deleteById(id);
    }

    @Override
    public List<PortfolioDto> getAllPortfolios() {
        return portfolioRepository.findAll().stream().map(PortfolioDto::fromEntity).collect(Collectors.toList());
    }
   
}
