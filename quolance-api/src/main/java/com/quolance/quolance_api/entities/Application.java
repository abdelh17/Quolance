package com.quolance.quolance_api.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "application")
public class Application extends  AbstractEntity{

    private String status;

    public void updateStatus(String status){
        this.status = status;
    }
}
