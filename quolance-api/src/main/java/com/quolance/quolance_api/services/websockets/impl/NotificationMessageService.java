package com.quolance.quolance_api.services.websockets.impl;

import com.quolance.quolance_api.dtos.websocket.NotificationResponseDto;
import com.quolance.quolance_api.entities.MessageEntity;
import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.NotificationRepository;
import com.quolance.quolance_api.services.entity_services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationMessageService extends AbstractWebSocketService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    @Override
    public boolean supports(String messageType) {
        return "NOTIFICATION".equalsIgnoreCase(messageType);
    }

    /**
     * Overloaded processNotification to handle Notification directly.
     *
     * @param notification The Notification object.
     */
    private void processNotification(Notification notification) {
        log.debug("Processing notification for user: {}", notification.getRecipient().getUsername());

        // Save the notification to the database
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        // Convert the Notification entity to a NotificationResponseDto
        NotificationResponseDto responseDto = NotificationResponseDto.fromEntity(notification);

        // Send the NotificationResponseDto via WebSocket to the specific user
        messagingTemplate.convertAndSendToUser(notification.getRecipient().getUsername(), "/topic/notifications", responseDto);
    }

    /**
     * Process a generic `MessageEntity` and adapt it to a `Notification`.
     *
     * @param message   The incoming message entity.
     * @param userName The recipient's userName.
     */
    @Override
    public void processMessage(MessageEntity message, String userName) {
        log.debug("Adapting MessageEntity to Notification for user: {}", userName);

        Optional<User> senderOpt = userService.findByUsername(message.getSender());
        Optional<User> recipientOpt = userService.findByUsername(userName);

        if (!senderOpt.isPresent() || !recipientOpt.isPresent()) {
            throw new IllegalArgumentException("Sender or recipient not found");
        }

        User sender = senderOpt.get();
        User recipient = recipientOpt.get();

        // Adapt MessageEntity to Notification
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setMessage(message.getMessage());

        // Process the adapted Notification
        processNotification(notification);
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
     * Send notifications to multiple users.
     *
     * @param recipients List of recipient users to send the notification to.
     * @param message    The notification message.
     */
    public void sendNotificationToUsers(List<User> recipients, String message) {
        log.debug("Sending notification to multiple users.");

        for (User recipient : recipients) {
            Notification notification = new Notification();
            notification.setRecipient(recipient);
            notification.setMessage(message);
            processNotification(notification);
        }
    }

    /**
     * Send a notification to a single user.
     *
     * @param recipient The recipient user.
     * @param message   The notification message.
     */
    public void sendNotificationToUser(User recipient, String message) {
        log.debug("Sending notification to user: {}", recipient.getUsername());

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        processNotification(notification);
    }

    /**
     * Send notifications with an optional sender.
     *
     * @param sender    The sender of the notification (optional).
     * @param recipient The recipient user.
     * @param message   The notification message.
     */
    public void sendNotification(User sender, User recipient, String message) {
        log.debug("Sending notification from {} to {}",
                sender != null ? sender.getUsername() : "System", recipient.getUsername());

        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setMessage(message);
        processNotification(notification);
    }
}
