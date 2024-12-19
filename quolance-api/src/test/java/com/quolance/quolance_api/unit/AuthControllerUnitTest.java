package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.UserResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.auth.AuthService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthController authController;

    private LoginRequestDto loginRequest;
    private UserResponseDto userResponse;
    private User mockUser;

    @BeforeEach
    void setUp() {
        // Setup login request
        loginRequest = new LoginRequestDto();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // Setup mock user
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setFirstName("Test");
        mockUser.setLastName("User");
        mockUser.setRole(Role.CLIENT);
        mockUser.setVerified(true);
        mockUser.setProfileImageUrl(null);
        mockUser.setConnectedAccounts(new ArrayList<>());

        // Create UserResponseDto from mock user
        userResponse = new UserResponseDto(mockUser);
    }

    @Test
    void login_ReturnsOkResponse() {
        // Arrange
        doNothing().when(authService).login(request, response, loginRequest);

        // Act
        ResponseEntity<?> responseEntity = authController.login(request, response, loginRequest);

        // Assert
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(authService, times(1)).login(request, response, loginRequest);
    }

    @Test
    void login_WhenInvalidCredentials_ThrowsBadCredentialsException() {
        // Arrange
        doThrow(new BadCredentialsException("Invalid credentials"))
                .when(authService).login(request, response, loginRequest);

        // Act & Assert
        assertThatThrownBy(() -> authController.login(request, response, loginRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid credentials");
        verify(authService, times(1)).login(request, response, loginRequest);
    }

    @Test
    void login_WhenUserNotVerified_ThrowsApiException() {
        // Arrange
        doThrow(new ApiException("User not verified"))
                .when(authService).login(request, response, loginRequest);

        // Act & Assert
        assertThatThrownBy(() -> authController.login(request, response, loginRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("User not verified");
        verify(authService, times(1)).login(request, response, loginRequest);
    }

    @Test
    void getSession_ReturnsUserResponse() {
        // Arrange
        when(authService.getSession(request)).thenReturn(userResponse);

        // Act
        ResponseEntity<UserResponseDto> responseEntity = authController.getSession(request);

        // Assert
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isEqualTo(userResponse);
        assertThat(responseEntity.getBody().getId()).isEqualTo(1L);
        assertThat(responseEntity.getBody().getEmail()).isEqualTo("test@example.com");
        assertThat(responseEntity.getBody().getFirstName()).isEqualTo("Test");
        assertThat(responseEntity.getBody().getLastName()).isEqualTo("User");
        assertThat(responseEntity.getBody().getRole()).isEqualTo(Role.CLIENT);
        verify(authService, times(1)).getSession(request);
    }

    @Test
    void getSession_WhenNoActiveSession_ThrowsApiException() {
        // Arrange
        when(authService.getSession(request))
                .thenThrow(new ApiException("No active session found"));

        // Act & Assert
        assertThatThrownBy(() -> authController.getSession(request))
                .isInstanceOf(ApiException.class)
                .hasMessage("No active session found");
        verify(authService, times(1)).getSession(request);
    }

    @Test
    void logout_ReturnsOkResponse() {
        // Arrange
        doNothing().when(authService).logout(request, response);

        // Act
        ResponseEntity<Void> responseEntity = authController.logout(request, response);

        // Assert
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(authService, times(1)).logout(request, response);
    }

    @Test
    void logout_WhenNoActiveSession_ThrowsApiException() {
        // Arrange
        doThrow(new ApiException("No active session to logout from"))
                .when(authService).logout(request, response);

        // Act & Assert
        assertThatThrownBy(() -> authController.logout(request, response))
                .isInstanceOf(ApiException.class)
                .hasMessage("No active session to logout from");
        verify(authService, times(1)).logout(request, response);
    }

    @Test
    void csrf_ReturnsOkResponse() {
        // Act
        ResponseEntity<?> responseEntity = authController.csrf();

        // Assert
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}