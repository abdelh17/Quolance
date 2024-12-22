package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.dtos.UpdatePendingUserRequestDto;
import com.quolance.quolance_api.dtos.UserResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PendingWorkflowServiceUnitTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PendingWorkflowServiceImpl pendingWorkflowService;

    private User mockUser;
    private UpdatePendingUserRequestDto updateDto;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .password("encoded_password")
                .firstName("Test")
                .lastName("User")
                .role(Role.PENDING)
                .verified(true)
                .connectedAccounts(new ArrayList<>())
                .build();

        updateDto = new UpdatePendingUserRequestDto();
        updateDto.setPassword("newPassword123");
        updateDto.setRole("CLIENT");
    }

    @Test
    void updatePendingUser_Success() {
        try (MockedStatic<ApplicationContextProvider> applicationContextProvider = mockStatic(ApplicationContextProvider.class)) {
            applicationContextProvider.when(() -> ApplicationContextProvider.bean(PasswordEncoder.class))
                    .thenReturn(passwordEncoder);
            when(passwordEncoder.encode(updateDto.getPassword())).thenReturn("encoded_new_password");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            UserResponseDto response = pendingWorkflowService.updatePendingUser(mockUser, updateDto);

            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(mockUser.getId());
            assertThat(response.getRole()).isEqualTo(Role.CLIENT);

            verify(passwordEncoder).encode(updateDto.getPassword());
            verify(userRepository).save(mockUser);
        }
    }

    @Test
    void updatePendingUser_NonPendingUser_ThrowsException() {
        mockUser.setRole(Role.CLIENT);

        assertThatThrownBy(() -> pendingWorkflowService.updatePendingUser(mockUser, updateDto))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 403)
                .hasMessage("You are not authorized to update your role and password.");

        verifyNoInteractions(userRepository);
    }

    @Test
    void updatePendingUser_InvalidRole_ThrowsException() {
        updateDto.setRole("INVALID_ROLE");

        assertThatThrownBy(() -> pendingWorkflowService.updatePendingUser(mockUser, updateDto))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 400)
                .hasMessage("Invalid role. Must be either CLIENT or FREELANCER.");

        verifyNoInteractions(userRepository);
    }

    @Test
    void updatePendingUser_AdminRole_ThrowsException() {
        try (MockedStatic<ApplicationContextProvider> applicationContextProvider = mockStatic(ApplicationContextProvider.class)) {
            applicationContextProvider.when(() -> ApplicationContextProvider.bean(PasswordEncoder.class))
                    .thenReturn(passwordEncoder);

            updateDto.setRole("ADMIN");

            assertThatThrownBy(() -> pendingWorkflowService.updatePendingUser(mockUser, updateDto))
                    .isInstanceOf(ApiException.class)
                    .hasFieldOrPropertyWithValue("status", 400)
                    .hasMessage("Invalid role. Must be either CLIENT or FREELANCER.");

            verifyNoInteractions(userRepository);
        }
    }

    @Test
    void updatePendingUser_FreelancerRole_Success() {
        try (MockedStatic<ApplicationContextProvider> applicationContextProvider = mockStatic(ApplicationContextProvider.class)) {
            applicationContextProvider.when(() -> ApplicationContextProvider.bean(PasswordEncoder.class))
                    .thenReturn(passwordEncoder);
            when(passwordEncoder.encode(updateDto.getPassword())).thenReturn("encoded_new_password");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            updateDto.setRole("FREELANCER");
            UserResponseDto response = pendingWorkflowService.updatePendingUser(mockUser, updateDto);

            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(mockUser.getId());
            assertThat(response.getRole()).isEqualTo(Role.FREELANCER);

            verify(passwordEncoder).encode(updateDto.getPassword());
            verify(userRepository).save(mockUser);
        }
    }
}