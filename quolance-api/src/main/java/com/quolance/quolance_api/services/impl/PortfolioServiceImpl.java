package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.entities.Portfolio;
import com.quolance.quolance_api.repositories.PortfolioRepository;
import com.quolance.quolance_api.services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PortfolioServiceImpl implements PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Override
    public Portfolio createPortfolio(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    @Override
    public Portfolio getPortfolioById(Long id) {
        Optional<Portfolio> portfolio = portfolioRepository.findById(id);
        return portfolio.orElseThrow(() -> new RuntimeException("Portfolio was not found"));
    }

    @Override
    public Portfolio updatePortfolio(Long id, Portfolio updatedPortfolio) {
        Portfolio portfolio = getPortfolioById(id);
        portfolio.setName(updatedPortfolio.getName());
        portfolio.setPortfolioItems(updatedPortfolio.getPortfolioItems());
        return portfolioRepository.save(portfolio);
    }

    @Override
    public void deletePortfolio(Long id) {
        portfolioRepository.deleteById(id);
    }

    @Override
    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }
}
