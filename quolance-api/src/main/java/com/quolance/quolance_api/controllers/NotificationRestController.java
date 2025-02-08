package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.websocket.NotificationResponseDto;
import com.quolance.quolance_api.dtos.websocket.SendNotificationRequestDto;
import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationRestController {

    private final NotificationMessageService notificationMessageService;
    private final UserService userService; // Added UserService to fetch User entities

    @PostMapping("/send")
    @Operation(summary = "Send a notification to specific users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification sent successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<Void> sendNotification(@Valid @RequestBody SendNotificationRequestDto request) {
        User sender = SecurityUtil.getAuthenticatedUser();
        request.getRecipientIds().forEach(recipientId -> {
            // Fetch recipient User object
            User recipient = userService.findById(recipientId)
                    .orElseThrow(() -> new RuntimeException("Recipient not found with ID: " + recipientId));

            Notification notification = new Notification();
            notification.setSender(sender);
            notification.setRecipient(recipient); // Set the recipient User object
            notification.setMessage(request.getMessage());
            notification.setTimestamp(java.time.LocalDateTime.now());
            notification.setRead(false);
        });

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id) {
        notificationMessageService.markNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    @Operation(summary = "Get all notifications for the authenticated user")
    public ResponseEntity<List<NotificationResponseDto>> getNotifications() {
        User recipient = SecurityUtil.getAuthenticatedUser();
        List<Notification> notifications = notificationMessageService.getNotificationsForUser(recipient.getId());
        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::fromEntity)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all-unread")
    @Operation(summary = "Get all unread notifications for the authenticated user")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications() {
        User recipient = SecurityUtil.getAuthenticatedUser();
        List<Notification> notifications = notificationMessageService.getUnreadNotificationsForUser(recipient.getId());
        List<NotificationResponseDto> response = notifications.stream()
                .map(NotificationResponseDto::fromEntity)
                .toList();
        return ResponseEntity.ok(response);
    }
}
