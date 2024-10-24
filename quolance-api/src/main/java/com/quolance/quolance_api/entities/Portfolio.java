package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "portfolio")
public class Portfolio extends AbstractEntity{

    private String name;

    @OneToOne(mappedBy = "portfolio")
    private PortfolioItem item;

    @OneToOne(mappedBy = "portfolio")
    private User user;


}
