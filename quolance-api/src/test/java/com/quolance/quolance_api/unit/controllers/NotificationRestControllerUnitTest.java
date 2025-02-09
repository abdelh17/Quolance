package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.NotificationRestController;
import com.quolance.quolance_api.dtos.users.UserDto;
import com.quolance.quolance_api.dtos.websocket.NotificationResponseDto;
import com.quolance.quolance_api.dtos.websocket.SendNotificationRequestDto;
import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.entity_services.UserService;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationRestControllerUnitTest {

    @Mock
    private NotificationMessageService notificationMessageService;

    @Mock
    private UserService userService;

    @InjectMocks
    private NotificationRestController notificationRestController;

    private User mockSender;
    private User mockRecipient;
    private Notification mockNotification;
    private SendNotificationRequestDto sendNotificationRequest;
    private NotificationResponseDto mockNotificationResponse;
    private LocalDateTime now;

    @BeforeEach
    void setUp() {
        now = LocalDateTime.now();

        mockSender = new User();
        mockSender.setId(1L);
        mockSender.setEmail("sender@test.com");
        mockSender.setRole(Role.CLIENT);

        mockRecipient = new User();
        mockRecipient.setId(2L);
        mockRecipient.setEmail("recipient@test.com");
        mockRecipient.setRole(Role.FREELANCER);

        mockNotification = new Notification();
        mockNotification.setId(1L);
        mockNotification.setSender(mockSender);
        mockNotification.setRecipient(mockRecipient);
        mockNotification.setMessage("Test notification");
        mockNotification.setTimestamp(now);
        mockNotification.setRead(false);

        mockNotificationResponse = NotificationResponseDto.builder()
                .id(1L)
                .message("Test notification")
                .read(false)
                .timestamp(now)
                .sender(UserDto.fromEntity(mockSender))
                .recipient(UserDto.fromEntity(mockRecipient))
                .build();

        sendNotificationRequest = SendNotificationRequestDto.builder()
                .message("Test notification")
                .recipientIds(List.of(2L))
                .build();
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
        doNothing().when(notificationMessageService).markNotificationAsRead(1L);

        ResponseEntity<Void> response = notificationRestController.markNotificationAsRead(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(notificationMessageService).markNotificationAsRead(1L);
    }

    @Test
    void markNotificationAsRead_NotificationNotFound_ThrowsException() {
        doThrow(new RuntimeException("Notification not found"))
                .when(notificationMessageService).markNotificationAsRead(999L);

        assertThatThrownBy(() -> notificationRestController.markNotificationAsRead(999L))
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