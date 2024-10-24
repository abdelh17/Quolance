package com.quolance.quolance_api.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "admin")
@Entity
@Getter
@Setter
public class Admin extends AbstractEntity{

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
    private List <SupportTicket> supportTickets;
}
