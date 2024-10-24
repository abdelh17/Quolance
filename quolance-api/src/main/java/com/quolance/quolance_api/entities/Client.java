package com.quolance.quolance_api.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Table(name = "client")
@Entity
@Getter
@Setter
public class Client extends AbstractEntity {

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Project> projects;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<SupportTicket> supportTickets;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Chat> Chats;



    public Client() {

    }


    public void postProject(Project Project) {

    }

    public void cancelProject(Project Project) {

    }

    public void selectFreelancer(Freelancer freelancer, Project project) {

    }

    }
