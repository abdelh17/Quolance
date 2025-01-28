package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.PendingController;
import com.quolance.quolance_api.dtos.users.UpdatePendingUserRequestDto;
import com.quolance.quolance_api.dtos.users.UserResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.auth.PendingWorkflowService;
import com.quolance.quolance_api.util.SecurityUtil;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PendingControllerUnitTest {

    @Mock
    private PendingWorkflowService pendingWorkflowService;

    @InjectMocks
    private PendingController pendingController;

    private User mockUser;
    private UpdatePendingUserRequestDto updateDto;
    private UserResponseDto responseDto;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("test@example.com");
        mockUser.setRole(Role.PENDING);

        updateDto = new UpdatePendingUserRequestDto();
        updateDto.setPassword("newPassword123");
        updateDto.setRole("CLIENT");

        responseDto = new UserResponseDto(mockUser);
        responseDto.setId(UUID.randomUUID());
        responseDto.setEmail("test@example.com");
        responseDto.setRole(Role.CLIENT);
    }

    @Test
    void updatePendingUser_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(pendingWorkflowService.updatePendingUser(mockUser, updateDto))
                    .thenReturn(responseDto);

            ResponseEntity<UserResponseDto> response = pendingController.updatePendingUser(updateDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody())
                    .isNotNull()
                    .usingRecursiveComparison()
                    .isEqualTo(responseDto);
            verify(pendingWorkflowService).updatePendingUser(mockUser, updateDto);
            verifyNoMoreInteractions(pendingWorkflowService);
        }
    }

    @Test
    void updatePendingUser_WithUnauthorizedUser_ThrowsAccessDeniedException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            when(pendingWorkflowService.updatePendingUser(mockUser, updateDto))
                    .thenThrow(new AccessDeniedException("User not authorized to perform this action"));

            assertThatThrownBy(() -> pendingController.updatePendingUser(updateDto))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("User not authorized to perform this action");
            verify(pendingWorkflowService).updatePendingUser(mockUser, updateDto);
            verifyNoMoreInteractions(pendingWorkflowService);
        }
    }

    @Test
    void updatePendingUser_WithInvalidRole_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            updateDto.setRole("ADMIN");
            when(pendingWorkflowService.updatePendingUser(mockUser, updateDto))
                    .thenThrow(ApiException.builder()
                            .message("Invalid role selection for pending user")
                            .status(400)
                            .build());

            assertThatThrownBy(() -> pendingController.updatePendingUser(updateDto))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Invalid role selection for pending user");
            verify(pendingWorkflowService).updatePendingUser(mockUser, updateDto);
            verifyNoMoreInteractions(pendingWorkflowService);
        }
    }

    @Test
    void updatePendingUser_WithInvalidPassword_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            updateDto.setPassword("weak");
            when(pendingWorkflowService.updatePendingUser(mockUser, updateDto))
                    .thenThrow(ApiException.builder()
                            .message("Password does not meet security requirements")
                            .status(400)
                            .build());

            assertThatThrownBy(() -> pendingController.updatePendingUser(updateDto))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Password does not meet security requirements");
            verify(pendingWorkflowService).updatePendingUser(mockUser, updateDto);
            verifyNoMoreInteractions(pendingWorkflowService);
        }
    }

    @Test
    void updatePendingUser_WithInvalidRequestBody_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);
            UpdatePendingUserRequestDto invalidDto = new UpdatePendingUserRequestDto();
            invalidDto.setPassword("short");
            invalidDto.setRole("INVALID_ROLE");

            when(pendingWorkflowService.updatePendingUser(mockUser, invalidDto))
                    .thenThrow(ApiException.builder()
                            .message("Invalid request data")
                            .status(400)
                            .build());

            assertThatThrownBy(() -> pendingController.updatePendingUser(invalidDto))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Invalid request data");
            verify(pendingWorkflowService).updatePendingUser(mockUser, invalidDto);
            verifyNoMoreInteractions(pendingWorkflowService);
        }
    }
}