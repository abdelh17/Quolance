package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.websocket.NotificationResponseDto;
import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.services.websockets.NotificationService;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    private final NotificationService notificationService;

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

    @PostMapping("/send-test-notification")
    @Operation(
            summary = "Send a test notification",
            description = "Send a test notification to the authenticated user"
    )
    public ResponseEntity<String> sendTestNotification(@RequestBody String message) {
        User client = SecurityUtil.getAuthenticatedUser();
        notificationMessageService.sendNotificationToUser(client, client, message);
        return ResponseEntity.ok("Test notification sent successfully");
    }

}
