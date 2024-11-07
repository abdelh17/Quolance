package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    Portfolio findByName(String name);
}
