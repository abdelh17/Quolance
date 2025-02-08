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
     * Processes the given Notification by saving it to the database and sending it via WebSocket.
     * Ensures that both sender and recipient are present.
     *
     * @param notification The notification to process.
     */
    private void processNotification(Notification notification) {
        // Validate that the recipient is not null.
        if (notification.getRecipient() == null) {
            throw new IllegalArgumentException("Notification recipient cannot be null");
        }
        if (notification.getSender() == null) {
            throw new IllegalArgumentException("Notification sender cannot be null");
        }

        log.debug("Processing notification from {} to user: {}",
                notification.getSender().getUsername(),
                notification.getRecipient().getUsername());

        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        NotificationResponseDto responseDto = NotificationResponseDto.fromEntity(notification);
        messagingTemplate.convertAndSendToUser(notification.getRecipient().getUsername(), "/topic/notifications", responseDto);
    }

    /**
     * Adapts a MessageEntity to a Notification with both sender and recipient.
     *
     * @param message  The incoming message entity.
     * @param userName The username of the recipient.
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

        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setMessage(message.getMessage());

        processNotification(notification);
    }

    /**
     * Marks a notification as read by its ID.
     *
     * @param notificationId The ID of the notification.
     */
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Retrieves all notifications for a specific user.
     *
     * @param userId The user's ID.
     * @return List of notifications.
     */
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientId(userId);
    }

    /**
     * Retrieves all unread notifications for a specific user.
     *
     * @param userId The user's ID.
     * @return List of unread notifications.
     */
    public List<Notification> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdAndRead(userId, false);
    }

    /**
     * Sends a notification to multiple users.
     *
     * @param sender     The sender of the notification.
     * @param recipients List of recipient users.
     * @param message    The notification message.
     */
    public void sendNotificationToUsers(User sender, List<User> recipients, String message) {
        log.debug("Sending notification from {} to multiple users",
                sender != null ? sender.getUsername() : "System");

        for (User recipient : recipients) {
            sendNotification(sender, recipient, message);
        }
    }

    /**
     * Sends a notification to a single user.
     *
     * @param sender    The sender of the notification.
     * @param recipient The recipient user.
     * @param message   The notification message.
     */
    public void sendNotificationToUser(User sender, User recipient, String message) {
        log.debug("Sending notification from {} to user: {}",
                sender != null ? sender.getUsername() : "System", recipient.getUsername());
        sendNotification(sender, recipient, message);
    }

    /**
     * Creates and processes a notification with both a sender and a recipient.
     *
     * @param sender    The sender of the notification.
     * @param recipient The recipient user.
     * @param message   The notification message.
     */
    public void sendNotification(User sender, User recipient, String message) {
        log.debug("Sending notification from {} to {} in sendNotification",
                sender != null ? sender.getUsername() : "System", recipient.getUsername());

        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setMessage(message);

        processNotification(notification);
    }
}
