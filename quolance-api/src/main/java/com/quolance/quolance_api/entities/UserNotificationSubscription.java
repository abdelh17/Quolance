package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_notification_subscription")
public class UserNotificationSubscription<date> extends AbstractEntity{

    private date subscriptionDate;
    private boolean isMuted;
    private String customMessage;



}
