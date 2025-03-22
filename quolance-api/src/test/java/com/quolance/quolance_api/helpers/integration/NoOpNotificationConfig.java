package com.quolance.quolance_api.helpers.integration;

import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@TestConfiguration
public class NoOpNotificationConfig {
    @Bean
    public NotificationMessageService notificationMessageService() {
        return new NotificationMessageService(null, null, null) {
            @Override
            public void markNotificationAsRead(UUID notificationId) {
                // No-op
            }

            @Override
            public List<Notification> getNotificationsForUser(UUID userId) {
                return Collections.emptyList();
            }

            @Override
            public List<Notification> getUnreadNotificationsForUser(UUID userId) {
                return Collections.emptyList();
            }

            @Override
            public void sendNotificationToUsers(User sender, List<User> recipients, String message) {
                // No-op
            }

            @Override
            public void sendNotificationToUser(User sender, User recipient, String message) {
                // No-op
            }

            @Override
            public void sendNotification(User sender, User recipient, String message) {
                // No-op
            }
        };
    }
}
