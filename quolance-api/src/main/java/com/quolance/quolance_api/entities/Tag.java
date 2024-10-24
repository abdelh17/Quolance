package com.quolance.quolance_api.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.service.annotation.GetExchange;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "tag")
public class Tag extends AbstractEntity{

    private String tagName;

    @ManyToMany(mappedBy = "tag", cascade = CascadeType.ALL)
    private List<Project> project;



}
