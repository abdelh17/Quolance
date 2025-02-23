package com.quolance.quolance_api.services.websockets;

import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;

import java.util.List;
import java.util.UUID;

/**
 * Interface defining the contract for notification operations via WebSockets.
 */
public interface NotificationService {


    /**
     * Marks a notification as read.
     *
     * @param notificationId the unique identifier of the notification.
     */
    void markNotificationAsRead(UUID notificationId);

    /**
     * Retrieves all notifications for a given user.
     *
     * @param userId the identifier of the user.
     * @return a list of notifications for the user.
     */
    List<Notification> getNotificationsForUser(UUID userId);

    /**
     * Retrieves all unread notifications for a given user.
     *
     * @param userId the identifier of the user.
     * @return a list of unread notifications for the user.
     */
    List<Notification> getUnreadNotificationsForUser(UUID userId);

    /**
     * Sends a notification to multiple users.
     *
     * @param sender the sender of the notification.
     * @param recipients a list of recipient users.
     * @param message the notification message.
     */
    void sendNotificationToUsers(User sender, List<User> recipients, String message);

    /**
     * Sends a notification to a single user.
     *
     * @param sender the sender of the notification.
     * @param recipient the recipient user.
     * @param message the notification message.
     */
    void sendNotificationToUser(User sender, User recipient, String message);

    /**
     * Creates and processes a notification with both a sender and a recipient.
     *
     * @param sender the sender of the notification.
     * @param recipient the recipient of the notification.
     * @param message the notification message.
     */
    void sendNotification(User sender, User recipient, String message);
}
