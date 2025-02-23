package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.NotificationRestController;
import com.quolance.quolance_api.dtos.websocket.NotificationResponseDto;
import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.SecurityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationRestControllerUnitTest {

    @Mock
    private NotificationMessageService notificationMessageService;

    @InjectMocks
    private NotificationRestController notificationRestController;

    private User mockSender;
    private User mockRecipient;
    private Notification mockNotification;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();

        mockSender = new User();
        mockSender.setId(UUID.randomUUID());
        mockSender.setEmail("sender@test.com");
        mockSender.setRole(Role.CLIENT);

        mockRecipient = new User();
        mockRecipient.setId(UUID.randomUUID());
        mockRecipient.setEmail("recipient@test.com");
        mockRecipient.setRole(Role.FREELANCER);

        mockNotification = new Notification();
        mockNotification.setId(UUID.randomUUID());
        mockNotification.setSender(mockSender);
        mockNotification.setRecipient(mockRecipient);
        mockNotification.setMessage("Test notification");
        mockNotification.setTimestamp(now);
        mockNotification.setRead(false);
    }

    @Test
    void sendTestNotification_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockSender);
            String testMessage = "Test notification";
            doNothing().when(notificationMessageService).sendNotificationToUser(mockSender, mockSender, testMessage);

            ResponseEntity<String> response = notificationRestController.sendTestNotification(testMessage);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Test notification sent successfully");
            verify(notificationMessageService).sendNotificationToUser(mockSender, mockSender, testMessage);
        }
    }

    @Test
    void sendTestNotification_EmptyMessage_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockSender);
            String emptyMessage = "";
            doNothing().when(notificationMessageService).sendNotificationToUser(mockSender, mockSender, emptyMessage);

            ResponseEntity<String> response = notificationRestController.sendTestNotification(emptyMessage);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Test notification sent successfully");
            verify(notificationMessageService).sendNotificationToUser(mockSender, mockSender, emptyMessage);
        }
    }

    @Test
    void sendTestNotification_NullMessage_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockSender);
            doNothing().when(notificationMessageService).sendNotificationToUser(mockSender, mockSender, null);

            ResponseEntity<String> response = notificationRestController.sendTestNotification(null);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Test notification sent successfully");
            verify(notificationMessageService).sendNotificationToUser(mockSender, mockSender, null);
        }
    }

    @Test
    void markNotificationAsRead_Success() {
        UUID id = UUID.randomUUID();
        doNothing().when(notificationMessageService).markNotificationAsRead(id);

        ResponseEntity<Void> response = notificationRestController.markNotificationAsRead(id);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(notificationMessageService).markNotificationAsRead(id);
    }

    @Test
    void markNotificationAsRead_NotificationNotFound_ThrowsException() {
        UUID id = UUID.randomUUID();
        doThrow(new RuntimeException("Notification not found"))
                .when(notificationMessageService).markNotificationAsRead(id);

        assertThatThrownBy(() -> notificationRestController.markNotificationAsRead(id))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Notification not found");
    }

    @Test
    void getNotifications_ReturnsNotificationList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockRecipient);
            List<Notification> notifications = Arrays.asList(mockNotification);
            when(notificationMessageService.getNotificationsForUser(mockRecipient.getId()))
                    .thenReturn(notifications);

            ResponseEntity<List<NotificationResponseDto>> response = notificationRestController.getNotifications();

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).hasSize(1);
            assertThat(response.getBody().get(0).getMessage()).isEqualTo("Test notification");
            assertThat(response.getBody().get(0).getTimestamp()).isEqualTo(now);
            assertThat(response.getBody().get(0).isRead()).isFalse();
            verify(notificationMessageService).getNotificationsForUser(mockRecipient.getId());
        }
    }

    @Test
    void getNotifications_ReturnsEmptyList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockRecipient);
            when(notificationMessageService.getNotificationsForUser(mockRecipient.getId()))
                    .thenReturn(List.of());

            ResponseEntity<List<NotificationResponseDto>> response = notificationRestController.getNotifications();

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEmpty();
            verify(notificationMessageService).getNotificationsForUser(mockRecipient.getId());
        }
    }

    @Test
    void getNotifications_ServiceThrowsException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockRecipient);
            when(notificationMessageService.getNotificationsForUser(mockRecipient.getId()))
                    .thenThrow(new RuntimeException("Error fetching notifications"));

            assertThatThrownBy(() -> notificationRestController.getNotifications())
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("Error fetching notifications");
        }
    }
}