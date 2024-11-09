package com.quolance.quolance_api.entities;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@Entity
@SuperBuilder
@Table(name = "portfolio")
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio extends AbstractEntity{

    private String name;

    @OneToMany(mappedBy = "portfolio")
    private List<PortfolioItem> portfolioItems;

    @OneToOne
    private User user;
}
