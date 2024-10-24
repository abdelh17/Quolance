package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notification_manager")
public class NotificationManager extends AbstractEntity implements NotificationType{

    private int id;
    private String name;

    public void subscribe(User user, NotificationType notificationType) {
    }

    public void unSubscribe(User user, NotificationType notificationType) {
    }

    public void sendNotification(NotificationType notificationType, String message) {
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public void triggerEvent(String message) {

    }
}


