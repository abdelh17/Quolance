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
     * Overloaded processMessage to handle Notification directly.
     *
     * @param notification The Notification object.
     * @param userName    The recipient's email.
     */
    public void processNotification(Notification notification, String userName) {
        log.debug("Processing notification for user: {}", userName);

        // Ensure recipient email matches
        if (!notification.getRecipient().getUsername().equals(userName)) {
            throw new IllegalArgumentException("Recipient email does not match provided user email");
        }

        // Save the notification to the database
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);

        // Convert the Notification entity to a NotificationResponseDto
        NotificationResponseDto responseDto = NotificationResponseDto.fromEntity(notification);

        //TODO: Test endpoint for SPECIFIC user, have a SENDALLNOTIF, and SENDNOTIFTOUSER(s) ENDPOINT where it might take an array of usernames
        //TODO: Look at documentation and modify frontned to handle this
        // Send the NotificationResponseDto via WebSocket
        //messagingTemplate.convertAndSendToUser(userName, "/topic/notifications", responseDto);

        // Broadcasting the Notification to all users for testing
        messagingTemplate.convertAndSend("/topic/notifications", responseDto);
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
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);
        // Process the adapted Notification
        processNotification(notification, userName);
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
        processNotification(notification, recipient.getUsername());
    }

}
