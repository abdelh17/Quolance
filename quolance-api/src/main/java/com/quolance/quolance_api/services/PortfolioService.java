package com.quolance.quolance_api.services;

import java.util.List;

import com.quolance.quolance_api.entities.Portfolio;

public interface PortfolioService {

    Portfolio createPortfolio(Portfolio portfolio);
    
    Portfolio getPortfolioById(Long id);
    
    Portfolio updatePortfolio(Long id, Portfolio portfolio);
    
    void deletePortfolio(Long id);
    
    List<Portfolio> getAllPortfolios();
}
