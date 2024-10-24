package com.quolance.quolance_api.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "freelancer")
public class Freelancer extends AbstractEntity{

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL)
    private List<Chat> Chats;

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL)
    private List<SupportTicket> supportTickets;

    @ManyToMany(mappedBy = "freelancers", cascade = CascadeType.ALL)
    private List<Application> applications;

    @OneToOne(mappedBy = "freelancer", cascade = CascadeType.ALL)
    private Portfolio portfolio;





}
