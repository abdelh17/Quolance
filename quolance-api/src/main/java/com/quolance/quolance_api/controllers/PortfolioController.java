package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.PortfolioDto;
import com.quolance.quolance_api.services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {
    
    private PortfolioService portfolioService;
    
    @PostMapping
    public ResponseEntity<PortfolioDto> createPortfolio(@RequestBody PortfolioDto portfolioDto) {
        PortfolioDto createdPortfolio = portfolioService.createPortfolio(portfolioDto, portfolioDto.getUserId());
        return ResponseEntity.ok(createdPortfolio);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PortfolioDto> getPortfolioById(@PathVariable Long id) {
        PortfolioDto portfolioDTO = portfolioService.getPortfolioById(id);
        return ResponseEntity.ok(portfolioDTO);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PortfolioDto> updatePortfolio(@PathVariable Long id, @RequestBody PortfolioDto portfolioDto) {
        PortfolioDto updatedPortfolio = portfolioService.updatePortfolio(id, portfolioDto);
        return ResponseEntity.ok(updatedPortfolio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePortfolio(@PathVariable Long id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PortfolioDto>> getAllPortfolios() {
        List<PortfolioDto> portfolios = portfolioService.getAllPortfolios();
        return ResponseEntity.ok(portfolios);
    }
}
