package com.quolance.quolance_api.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Entity
@Table(name = "portfolioItem")
@RequiredArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PortfolioItem extends AbstractEntity{

    private String name;
    @ManyToOne
    @JoinColumn(name = "portfolioId")
    private Portfolio portfolio;

}
