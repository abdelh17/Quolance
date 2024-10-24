package com.quolance.quolance_api.entities;


import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class SupportTicket extends AbstractEntity{

    private String subject;
    private String status;


}
