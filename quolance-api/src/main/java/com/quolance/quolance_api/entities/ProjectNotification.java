package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "project_notification")
@Entity
@Getter
@Setter
public class ProjectNotification extends AbstractEntity implements NotificationType{

    private int id;
    private String name;

    @Override
    public String getName() {
        return null;
    }

    @Override
    public void triggerEvent(String message) {

    }
}
