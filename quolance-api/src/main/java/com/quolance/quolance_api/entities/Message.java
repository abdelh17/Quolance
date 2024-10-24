package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "message")
public class Message extends AbstractEntity{

    private String content;

    private Date timeStamp;



}
