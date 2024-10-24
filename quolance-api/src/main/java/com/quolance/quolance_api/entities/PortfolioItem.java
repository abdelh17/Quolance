package com.quolance.quolance_api.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "portfolio_item")
public class PortfolioItem extends AbstractEntity{

    private String name;
}
