package com.quolance.quolance_api.unit.services.entity_services;

import com.quolance.quolance_api.dtos.users.CreateAdminRequestDto;
import com.quolance.quolance_api.dtos.users.CreateUserRequestDto;
import com.quolance.quolance_api.dtos.users.UpdateUserPasswordRequestDto;
import com.quolance.quolance_api.dtos.users.UpdateUserRequestDto;
import com.quolance.quolance_api.entities.*;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.jobs.SendResetPasswordEmailJob;
import com.quolance.quolance_api.jobs.SendWelcomeEmailJob;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.repositories.PasswordResetTokenRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.auth.VerificationCodeService;
import com.quolance.quolance_api.services.entity_services.impl.UserServiceImpl;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private VerificationCodeService verificationCodeService;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private MockedStatic<ApplicationContextProvider> applicationContextProviderMock;
    private MockedStatic<BackgroundJobRequest> backgroundJobRequestMock;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    private User mockUser;
    private VerificationCode mockVerificationCode;
    private PasswordResetToken mockPasswordResetToken;
    private CreateUserRequestDto createUserRequest;
    private CreateAdminRequestDto createAdminRequest;
    private UpdateUserRequestDto updateUserRequest;
    private UpdateUserPasswordRequestDto updatePasswordRequest;

    private User createMockUser() {
        return User.builder()
                .id(UUID.randomUUID())
                .email("test@test.com")
                .password("encoded_password")
                .firstName("Test")
                .lastName("User")
                .role(Role.CLIENT)
                .verified(false)
                .connectedAccounts(new ArrayList<>())
                .build();
    }

    @BeforeEach
    void setUp() {
        applicationContextProviderMock = mockStatic(ApplicationContextProvider.class);
        applicationContextProviderMock.when(() -> ApplicationContextProvider.bean(PasswordEncoder.class)).thenReturn(passwordEncoder);

        backgroundJobRequestMock = mockStatic(BackgroundJobRequest.class);
        backgroundJobRequestMock.when(() -> BackgroundJobRequest.enqueue(any(SendWelcomeEmailJob.class))).thenReturn(null);
        backgroundJobRequestMock.when(() -> BackgroundJobRequest.enqueue(any(SendResetPasswordEmailJob.class))).thenReturn(null);

        mockUser = createMockUser();

        mockVerificationCode = new VerificationCode(mockUser);
        mockVerificationCode.setCode("test_code");

        mockPasswordResetToken = new PasswordResetToken(mockUser);
        mockPasswordResetToken.onEmailSent();

        createUserRequest = CreateUserRequestDto.builder()
                .email("test@test.com")
                .username("testuser")
                .password("Password123")
                .passwordConfirmation("Password123")
                .firstName("Test")
                .lastName("User")
                .role(Role.CLIENT.name())
                .build();

        createAdminRequest = CreateAdminRequestDto.builder()
                .email("admin@test.com")
                .username("adminuser")
                .temporaryPassword("Admin123")
                .passwordConfirmation("Admin123")
                .firstName("Admin")
                .lastName("User")
                .build();

        updateUserRequest = UpdateUserRequestDto.builder()
                .firstName("Updated")
                .lastName("User")
                .build();

        updatePasswordRequest = UpdateUserPasswordRequestDto.builder()
                .oldPassword("OldPassword123")
                .password("NewPassword123")
                .confirmPassword("NewPassword123")
                .build();
    }

    @AfterEach
    void tearDown() {
        if (applicationContextProviderMock != null) {
            applicationContextProviderMock.close();
        }
        if (backgroundJobRequestMock != null) {
            backgroundJobRequestMock.close();
        }
    }

    @Test
    void create_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        userService.create(createUserRequest);

        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getFirstName()).isEqualTo(createUserRequest.getFirstName());
        assertThat(savedUser.getLastName()).isEqualTo(createUserRequest.getLastName());
        assertThat(savedUser.getRole()).isEqualTo(Role.valueOf(createUserRequest.getRole()));
    }

    @Test
    void create_EmailExists_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() -> userService.create(createUserRequest))
                .isInstanceOf(ApiException.class)
                .hasMessage("A user with this email already exists.");
    }

    @Test
    void createAdmin_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        userService.createAdmin(createAdminRequest);

        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getFirstName()).isEqualTo(createAdminRequest.getFirstName());
        assertThat(savedUser.getLastName()).isEqualTo(createAdminRequest.getLastName());
        assertThat(savedUser.getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    void forgotPassword_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(mockUser));
        when(passwordResetTokenRepository.save(any(PasswordResetToken.class))).thenReturn(mockPasswordResetToken);

        userService.forgotPassword("test@test.com");

        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));
        backgroundJobRequestMock.verify(() -> BackgroundJobRequest.enqueue(any(SendResetPasswordEmailJob.class)));
    }

    @Test
    void resetPassword_Success() {
        when(passwordResetTokenRepository.findByToken(anyString())).thenReturn(Optional.of(mockPasswordResetToken));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        updatePasswordRequest.setPasswordResetToken("reset_token");
        userService.resetPassword(updatePasswordRequest);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void resetPassword_TokenNotFound_ThrowsException() {
        when(passwordResetTokenRepository.findByToken(anyString())).thenReturn(Optional.empty());

        updatePasswordRequest.setPasswordResetToken("invalid_token");
        assertThatThrownBy(() -> userService.resetPassword(updatePasswordRequest))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 404)
                .hasMessage("Password reset token not found");
    }

    @Test
    void resetPassword_TokenExpired_ThrowsException() {
        try {
            java.lang.reflect.Field expiresAtField = PasswordResetToken.class.getDeclaredField("expiresAt");
            expiresAtField.setAccessible(true);
            expiresAtField.set(mockPasswordResetToken, LocalDateTime.now().minusHours(1));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        when(passwordResetTokenRepository.findByToken(anyString())).thenReturn(Optional.of(mockPasswordResetToken));

        updatePasswordRequest.setPasswordResetToken(mockPasswordResetToken.getToken());
        assertThatThrownBy(() -> userService.resetPassword(updatePasswordRequest))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 400)
                .hasMessage("Password reset token is expired");
    }

    @Test
    void updateUser_Success() {
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        userService.updateUser(updateUserRequest, mockUser);

        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getFirstName()).isEqualTo(updateUserRequest.getFirstName());
        assertThat(savedUser.getLastName()).isEqualTo(updateUserRequest.getLastName());
    }

    @Test
    void updatePassword_Success() {
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        userService.updatePassword(updatePasswordRequest, mockUser);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void updatePassword_WrongOldPassword_ThrowsException() {
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> userService.updatePassword(updatePasswordRequest, mockUser))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 400)
                .hasMessage("Wrong password");
    }

    @Test
    void findById_UserFound_ReturnsUser() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        Optional<User> result = userService.findById(mockUser.getId());

        assertThat(result)
                .isPresent()
                .contains(mockUser);
        verify(userRepository).findById(mockUser.getId());
    }

    @Test
    void findById_UserNotFound_ReturnsEmpty() {
        UUID id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        Optional<User> result = userService.findById(id);

        assertThat(result).isNotPresent();
        verify(userRepository).findById(id);
    }

    @Test
    void findByUsername_UserFound_ReturnsUser() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));

        Optional<User> result = userService.findByUsername("testuser");

        assertThat(result)
                .isPresent()
                .contains(mockUser);
        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void findByUsername_UserNotFound_ReturnsEmpty() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        Optional<User> result = userService.findByUsername("testuser");

        assertThat(result).isNotPresent();
        verify(userRepository).findByUsername("testuser");
    }

}