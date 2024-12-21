package com.quolance.quolance_api.unit;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.controllers.UsersController;
import com.quolance.quolance_api.dtos.*;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.entity_services.UserService;
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
import org.springframework.web.servlet.view.RedirectView;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersControllerUnitTest {

    @Mock
    private UserService userService;

    @Mock
    private ApplicationProperties applicationProperties;

    @InjectMocks
    private UsersController usersController;

    private User mockUser;
    private UserResponseDto mockUserResponse;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setRole(Role.CLIENT);

        mockUserResponse = new UserResponseDto(mockUser);
    }

    @Test
    void create_Success() {
        CreateUserRequestDto createRequest = CreateUserRequestDto.builder()
                .email("test@example.com")
                .password("Password123")
                .passwordConfirmation("Password123")
                .firstName("John")
                .lastName("Doe")
                .role("CLIENT")
                .build();

        when(userService.create(eq(createRequest))).thenReturn(mockUserResponse);

        ResponseEntity<UserResponseDto> response = usersController.create(createRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockUserResponse);
        verify(userService).create(eq(createRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void create_WithInvalidEmail_ThrowsApiException() {
        CreateUserRequestDto invalidRequest = CreateUserRequestDto.builder()
                .email("invalid-email")
                .password("Password123")
                .passwordConfirmation("Password123")
                .firstName("John")
                .lastName("Doe")
                .build();

        when(userService.create(eq(invalidRequest)))
                .thenThrow(ApiException.builder()
                        .message("Invalid email format")
                        .status(400)
                        .build());

        assertThatThrownBy(() -> usersController.create(invalidRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid email format");
        verify(userService).create(eq(invalidRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void create_WithPasswordMismatch_ThrowsApiException() {
        CreateUserRequestDto invalidRequest = CreateUserRequestDto.builder()
                .email("test@example.com")
                .password("Password123")
                .passwordConfirmation("DifferentPassword123")
                .firstName("John")
                .lastName("Doe")
                .build();

        when(userService.create(eq(invalidRequest)))
                .thenThrow(ApiException.builder()
                        .message("Passwords do not match")
                        .status(400)
                        .build());

        assertThatThrownBy(() -> usersController.create(invalidRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("Passwords do not match");
        verify(userService).create(eq(invalidRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void create_WithWeakPassword_ThrowsApiException() {
        CreateUserRequestDto invalidRequest = CreateUserRequestDto.builder()
                .email("test@example.com")
                .password("weak")
                .passwordConfirmation("weak")
                .firstName("John")
                .lastName("Doe")
                .build();

        when(userService.create(eq(invalidRequest)))
                .thenThrow(ApiException.builder()
                        .message("Password does not meet security requirements")
                        .status(400)
                        .build());

        assertThatThrownBy(() -> usersController.create(invalidRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("Password does not meet security requirements");
        verify(userService).create(eq(invalidRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void create_WithInvalidRole_ThrowsApiException() {
        CreateUserRequestDto invalidRequest = CreateUserRequestDto.builder()
                .email("test@example.com")
                .password("Password123")
                .passwordConfirmation("Password123")
                .firstName("John")
                .lastName("Doe")
                .role("INVALID_ROLE")
                .build();

        when(userService.create(eq(invalidRequest)))
                .thenThrow(ApiException.builder()
                        .message("Invalid role")
                        .status(400)
                        .build());

        assertThatThrownBy(() -> usersController.create(invalidRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid role");
        verify(userService).create(eq(invalidRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void createAdmin_Success() {
        CreateAdminRequestDto createRequest = CreateAdminRequestDto.builder()
                .email("admin@example.com")
                .temporaryPassword("Admin123!")
                .passwordConfirmation("Admin123!")
                .firstName("Admin")
                .lastName("User")
                .build();

        when(userService.createAdmin(eq(createRequest))).thenReturn(mockUserResponse);

        ResponseEntity<UserResponseDto> response = usersController.createAdmin(createRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockUserResponse);
        verify(userService).createAdmin(eq(createRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void createAdmin_WithInvalidEmail_ThrowsApiException() {
        CreateAdminRequestDto invalidRequest = CreateAdminRequestDto.builder()
                .email("invalid-email")
                .temporaryPassword("Admin123!")
                .passwordConfirmation("Admin123!")
                .firstName("Admin")
                .lastName("User")
                .build();

        when(userService.createAdmin(eq(invalidRequest)))
                .thenThrow(ApiException.builder()
                        .message("Invalid email format")
                        .status(400)
                        .build());

        assertThatThrownBy(() -> usersController.createAdmin(invalidRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid email format");
        verify(userService).createAdmin(eq(invalidRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void createAdmin_WithWeakPassword_ThrowsApiException() {
        CreateAdminRequestDto invalidRequest = CreateAdminRequestDto.builder()
                .email("admin@example.com")
                .temporaryPassword("weak")
                .passwordConfirmation("weak")
                .firstName("Admin")
                .lastName("User")
                .build();

        when(userService.createAdmin(eq(invalidRequest)))
                .thenThrow(ApiException.builder()
                        .message("Password does not meet security requirements")
                        .status(400)
                        .build());

        assertThatThrownBy(() -> usersController.createAdmin(invalidRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("Password does not meet security requirements");
        verify(userService).createAdmin(eq(invalidRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void createAdmin_WithPasswordMismatch_ThrowsApiException() {
        CreateAdminRequestDto invalidRequest = CreateAdminRequestDto.builder()
                .email("admin@example.com")
                .temporaryPassword("Admin123!")
                .passwordConfirmation("DifferentPassword!")
                .firstName("Admin")
                .lastName("User")
                .build();

        when(userService.createAdmin(eq(invalidRequest)))
                .thenThrow(ApiException.builder()
                        .message("Passwords do not match")
                        .status(400)
                        .build());

        assertThatThrownBy(() -> usersController.createAdmin(invalidRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("Passwords do not match");
        verify(userService).createAdmin(eq(invalidRequest));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void verifyEmail_Success() {
        String token = "valid-token";
        String loginPageUrl = "http://example.com/login";
        when(applicationProperties.getLoginPageUrl()).thenReturn(loginPageUrl);
        doNothing().when(userService).verifyEmail(token);

        RedirectView response = usersController.verifyEmail(token);

        assertThat(response.getUrl()).isEqualTo(loginPageUrl);
        verify(userService).verifyEmail(eq(token));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void verifyEmail_WithInvalidToken_ThrowsApiException() {
        String invalidToken = "invalid-token";
        doThrow(ApiException.builder()
                .message("Invalid token")
                .status(400)
                .build())
                .when(userService).verifyEmail(invalidToken);

        assertThatThrownBy(() -> usersController.verifyEmail(invalidToken))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid token");
        verify(userService).verifyEmail(eq(invalidToken));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void forgotPassword_Success() {
        ForgotPasswordRequestDto request = new ForgotPasswordRequestDto();
        request.setEmail("test@example.com");

        doNothing().when(userService).forgotPassword(request.getEmail());

        ResponseEntity<Void> response = usersController.forgotPassword(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(userService).forgotPassword(eq(request.getEmail()));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void forgotPassword_WithInvalidEmail_ThrowsApiException() {
        ForgotPasswordRequestDto request = new ForgotPasswordRequestDto();
        request.setEmail("invalid-email");

        doThrow(ApiException.builder()
                .message("Invalid email format")
                .status(400)
                .build())
                .when(userService).forgotPassword(request.getEmail());

        assertThatThrownBy(() -> usersController.forgotPassword(request))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid email format");
        verify(userService).forgotPassword(eq(request.getEmail()));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void resetPassword_Success() {
        UpdateUserPasswordRequestDto request = new UpdateUserPasswordRequestDto();
        request.setPassword("newPassword123");

        doNothing().when(userService).resetPassword(eq(request));

        ResponseEntity<Void> response = usersController.resetPassword(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(userService).resetPassword(eq(request));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void resetPassword_WithInvalidToken_ThrowsApiException() {
        UpdateUserPasswordRequestDto request = new UpdateUserPasswordRequestDto();
        request.setPassword("newPassword123");

        doThrow(ApiException.builder()
                .message("Invalid or expired token")
                .status(400)
                .build())
                .when(userService).resetPassword(eq(request));

        assertThatThrownBy(() -> usersController.resetPassword(request))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid or expired token");
        verify(userService).resetPassword(eq(request));
        verifyNoMoreInteractions(userService);
    }

    @Test
    void update_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);

            UpdateUserRequestDto request = new UpdateUserRequestDto();
            request.setFirstName("John");
            request.setLastName("Doe");

            when(userService.updateUser(eq(request), eq(mockUser))).thenReturn(mockUserResponse);

            ResponseEntity<UserResponseDto> response = usersController.update(request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(mockUserResponse);
            verify(userService).updateUser(eq(request), eq(mockUser));
            verifyNoMoreInteractions(userService);
        }
    }

    @Test
    void update_Unauthorized_ThrowsAccessDeniedException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);

            UpdateUserRequestDto request = new UpdateUserRequestDto();
            when(userService.updateUser(eq(request), eq(mockUser)))
                    .thenThrow(new AccessDeniedException("Not authorized to update user"));

            assertThatThrownBy(() -> usersController.update(request))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Not authorized to update user");
            verify(userService).updateUser(eq(request), eq(mockUser));
            verifyNoMoreInteractions(userService);
        }
    }

    @Test
    void updatePassword_Success() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);

            UpdateUserPasswordRequestDto request = new UpdateUserPasswordRequestDto();
            request.setPassword("newPassword123");

            when(userService.updatePassword(eq(request), eq(mockUser))).thenReturn(mockUserResponse);

            ResponseEntity<UserResponseDto> response = usersController.updatePassword(request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(mockUserResponse);
            verify(userService).updatePassword(eq(request), eq(mockUser));
            verifyNoMoreInteractions(userService);
        }
    }

    @Test
    void updatePassword_WithInvalidCredentials_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockUser);

            UpdateUserPasswordRequestDto request = new UpdateUserPasswordRequestDto();
            request.setPassword("newPassword123");
            request.setOldPassword("wrongPassword");

            when(userService.updatePassword(eq(request), eq(mockUser)))
                    .thenThrow(ApiException.builder()
                            .message("Invalid current password")
                            .status(400)
                            .build());

            assertThatThrownBy(() -> usersController.updatePassword(request))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Invalid current password");
            verify(userService).updatePassword(eq(request), eq(mockUser));
            verifyNoMoreInteractions(userService);
        }
    }
}