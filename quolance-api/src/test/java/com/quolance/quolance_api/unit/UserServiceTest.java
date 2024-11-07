package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.CreateUserRequestDto;
import com.quolance.quolance_api.dtos.UpdateUserPasswordRequestDto;
import com.quolance.quolance_api.dtos.UpdateUserRequestDto;
import com.quolance.quolance_api.dtos.UserResponseDto;
import com.quolance.quolance_api.entities.PasswordResetToken;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.jobs.SendResetPasswordEmailJob;
import com.quolance.quolance_api.jobs.SendWelcomeEmailJob;
import com.quolance.quolance_api.repositories.PasswordResetTokenRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.VerificationCodeRepository;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationCodeRepository verificationCodeRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private CreateUserRequestDto createUserRequest;
    private UpdateUserRequestDto updateUserRequest;
    private UpdateUserPasswordRequestDto updatePasswordRequest;
    private VerificationCode verificationCode;
    private PasswordResetToken passwordResetToken;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .password("encodedPassword")
                .role(Role.CLIENT)
                .connectedAccounts(new ArrayList<>())
                .build();

        createUserRequest = CreateUserRequestDto.builder()
                .email("test@example.com")
                .password("password123")
                .firstName("John")
                .lastName("Doe")
                .role("CLIENT")
                .build();

        updateUserRequest = new UpdateUserRequestDto();
        updateUserRequest.setFirstName("Jane");
        updateUserRequest.setLastName("Smith");

        updatePasswordRequest = new UpdateUserPasswordRequestDto();
        updatePasswordRequest.setOldPassword("oldPassword");
        updatePasswordRequest.setPassword("newPassword");

        verificationCode = new VerificationCode(testUser);
        passwordResetToken = new PasswordResetToken(testUser);
    }

    @Nested
    @DisplayName("Find User Tests")
    class FindUserTests {
        @Test
        @DisplayName("Should return user when exists")
        void findById_WhenUserExists_ReturnsUser() {
            // Arrange
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

            // Act
            Optional<User> result = userService.findById(1L);

            // Assert
            assertThat(result).isPresent();
            assertThat(result.get().getEmail()).isEqualTo(testUser.getEmail());
        }

        @Test
        @DisplayName("Should return empty when user doesn't exist")
        void findById_WhenUserDoesNotExist_ReturnsEmpty() {
            // Arrange
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // Act
            Optional<User> result = userService.findById(999L);

            // Assert
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("Create User Tests")
    class CreateUserTests {
        @Test
        @DisplayName("Should create user successfully")
        void create_WhenValidRequest_CreatesUser() {
            // Arrange
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            when(verificationCodeRepository.save(any(VerificationCode.class))).thenReturn(verificationCode);

            try (MockedStatic<BackgroundJobRequest> mockedStatic = mockStatic(BackgroundJobRequest.class)) {
                // Act
                UserResponseDto result = userService.create(createUserRequest);

                // Assert
                assertThat(result).isNotNull();
                assertThat(result.getEmail()).isEqualTo(createUserRequest.getEmail());
                verify(userRepository).save(any(User.class));
                verify(verificationCodeRepository).save(any(VerificationCode.class));
                mockedStatic.verify(() ->
                        BackgroundJobRequest.enqueue(any(SendWelcomeEmailJob.class)), times(1));
            }
        }

        @Test
        @DisplayName("Should throw exception when email exists")
        void create_WhenEmailExists_ThrowsException() {
            // Arrange
            when(userRepository.existsByEmail(anyString())).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> userService.create(createUserRequest))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("A user with this email already exists.");

            verify(userRepository, never()).save(any());
            verify(verificationCodeRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should not create user when request is null")
        void create_WhenRequestIsNull_ThrowsException() {
            assertThatThrownBy(() -> userService.create(null))
                    .isInstanceOf(IllegalArgumentException.class);

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Email Verification Tests")
    class EmailVerificationTests {
        @Test
        @DisplayName("Should verify email successfully")
        void verifyEmail_WhenValidCode_VerifiesEmail() {
            // Arrange
            String code = "valid-code";
            when(verificationCodeRepository.findByCode(code)).thenReturn(Optional.of(verificationCode));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userService.verifyEmail(code);

            // Assert
            verify(userRepository).save(any(User.class));
            verify(verificationCodeRepository).delete(verificationCode);
            assertThat(testUser.isVerified()).isTrue();
        }

    }

    @Nested
    @DisplayName("Password Management Tests")
    class PasswordManagementTests {
        @Test
        @DisplayName("Should process forgot password request")
        void forgotPassword_WhenValidEmail_ProcessesRequest() {
            // Arrange
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
            when(passwordResetTokenRepository.save(any())).thenReturn(passwordResetToken);

            try (MockedStatic<BackgroundJobRequest> mockedStatic = mockStatic(BackgroundJobRequest.class)) {
                // Act
                userService.forgotPassword("test@example.com");

                // Assert
                verify(passwordResetTokenRepository).save(any());
                mockedStatic.verify(() ->
                        BackgroundJobRequest.enqueue(any(SendResetPasswordEmailJob.class)), times(1));
            }
        }

        @Test
        @DisplayName("Should throw exception when email not found in forgot password")
        void forgotPassword_WhenEmailNotFound_ThrowsException() {
            // Arrange
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.forgotPassword("nonexistent@example.com"))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("User not found");
        }

        @Test
        @DisplayName("Should reset password with valid token")
        void resetPassword_WhenValidToken_ResetsPassword() {
            // Arrange
            UpdateUserPasswordRequestDto request = new UpdateUserPasswordRequestDto();
            request.setPassword("newPassword");
            request.setPasswordResetToken("valid-token");

            // Create valid token
            PasswordResetToken validToken = new PasswordResetToken(testUser);
            validToken.onEmailSent(); // This sets expiresAt to now + 10 minutes

            when(passwordResetTokenRepository.findByToken(anyString()))
                    .thenReturn(Optional.of(validToken));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userService.resetPassword(request);

            // Assert
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should throw exception for expired reset token")
        void resetPassword_WhenTokenExpired_ThrowsException() {
            // Arrange
            UpdateUserPasswordRequestDto request = new UpdateUserPasswordRequestDto();
            request.setPassword("newPassword");
            request.setPasswordResetToken("expired-token");

            // Create expired token using reflection to set expired time
            PasswordResetToken expiredToken = new PasswordResetToken(testUser);
            try {
                java.lang.reflect.Field expiresAtField = PasswordResetToken.class.getDeclaredField("expiresAt");
                expiresAtField.setAccessible(true);
                expiresAtField.set(expiredToken, LocalDateTime.now().minusMinutes(1));
            } catch (Exception e) {
                throw new RuntimeException("Failed to set expired token", e);
            }

            when(passwordResetTokenRepository.findByToken(anyString()))
                    .thenReturn(Optional.of(expiredToken));

            // Act & Assert
            assertThatThrownBy(() -> userService.resetPassword(request))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Password reset token is expired");

            // Verify password was not updated
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception for invalid reset token")
        void resetPassword_WhenInvalidToken_ThrowsException() {
            // Arrange
            UpdateUserPasswordRequestDto request = new UpdateUserPasswordRequestDto();
            request.setPassword("newPassword");
            request.setPasswordResetToken("invalid-token");

            when(passwordResetTokenRepository.findByToken(anyString())).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.resetPassword(request))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Password reset token not found");
        }

        @Test
        @DisplayName("Should update password when old password matches")
        void updatePassword_WhenOldPasswordMatches_UpdatesPassword() {
            // Arrange
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            UserResponseDto result = userService.updatePassword(updatePasswordRequest, testUser);

            // Assert
            assertThat(result).isNotNull();
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Should throw exception when old password is wrong")
        void updatePassword_WhenOldPasswordWrong_ThrowsException() {
            // Arrange
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

            // Act & Assert
            assertThatThrownBy(() -> userService.updatePassword(updatePasswordRequest, testUser))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Wrong password");
        }
    }

    @Nested
    @DisplayName("Update User Tests")
    class UpdateUserTests {
        @Test
        @DisplayName("Should update user information successfully")
        void updateUser_WhenValidRequest_UpdatesUser() {
            // Arrange
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            UserResponseDto result = userService.updateUser(updateUserRequest, testUser);

            // Assert
            assertThat(result).isNotNull();
            assertThat(testUser.getFirstName()).isEqualTo(updateUserRequest.getFirstName());
            assertThat(testUser.getLastName()).isEqualTo(updateUserRequest.getLastName());
            verify(userRepository).save(testUser);
        }
    }
}