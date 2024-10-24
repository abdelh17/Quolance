package com.quolance.quolance_api.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "chat")
public class Chat<date> extends AbstractEntity{

    private date createdAT;

    private date updatedAt;
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    private List<Message> message;
}
