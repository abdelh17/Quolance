package com.quolance.quolance_api.services.websockets.impl;

import com.quolance.quolance_api.entities.MessageEntity;
import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationMessageService extends AbstractWebSocketService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public boolean supports(String messageType) {
        return "NOTIFICATION".equalsIgnoreCase(messageType);
    }

    /**
     * Overloaded processMessage to handle Notification directly.
     *
     * @param notification The Notification object.
     * @param userEmail    The recipient's email.
     */
    public void processMessage(Notification notification, String userEmail) {
        log.debug("Processing notification for user: {}", userEmail);

        // Ensure recipient email matches
        if (!notification.getRecipient().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Recipient email does not match provided user email");
        }

        // Save the notification to the database
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        // Send the notification via WebSocket
        messagingTemplate.convertAndSendToUser(userEmail, "/topic/notifications", notification);
    }

    /**
     * Process a generic `MessageEntity` and adapt it to a `Notification`.
     *
     * @param message   The incoming message entity.
     * @param userEmail The recipient's email.
     */
    @Override
    public void processMessage(MessageEntity message, String userEmail) {
        log.debug("Adapting MessageEntity to Notification for user: {}", userEmail);

        User sender = fetchUserByEmail(message.getSender());
        User recipient = fetchUserByEmail(userEmail);

        // Adapt MessageEntity to Notification
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setMessage(message.getMessage());
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);

        // Process the adapted Notification
        processMessage(notification, userEmail);
    }

    /**
     * Fetch a user by their email (mock or implement retrieval logic).
     *
     * @param email The email of the user.
     * @return The user object.
     */
    private User fetchUserByEmail(String email) {
        // Mocked for now; implement retrieval logic from UserService or UserRepository
        User user = new User();
        user.setEmail(email);
        return user;
    }

    /**
     * Mark a notification as read by its ID.
     *
     * @param notificationId The ID of the notification to mark as read.
     */
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Retrieve all notifications for a specific user.
     *
     * @param userId The ID of the user.
     * @return List of notifications.
     */
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientId(userId);
    }

    /**
     * Send a notification from a sender to a recipient with a given message.
     *
     * @param sender    The user sending the notification.
     * @param recipient The user receiving the notification.
     * @param message   The notification message.
     */
    public void sendNotification(User sender, User recipient, String message) {
        log.debug("Sending notification from {} to {}", sender.getEmail(), recipient.getEmail());

        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);

        // Process and send the notification
        processMessage(notification, recipient.getEmail());
    }

}
