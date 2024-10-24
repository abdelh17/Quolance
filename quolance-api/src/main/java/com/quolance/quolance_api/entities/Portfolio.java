package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "portfolio")
public class Portfolio extends AbstractEntity{
    private String name;

    @OneToMany(mappedBy = "portfolio")
    private List<PortfolioItem> portfolioItems;

    @OneToOne(mappedBy = "portfolio")
    private User user;
}
