package com.quolance.quolance_api.entities;

public interface NotificationType {
    // Method to get the ID of the notification
    int getId();

    // Method to get the name of the notification
    String getName();

    void triggerEvent(String message);
}
