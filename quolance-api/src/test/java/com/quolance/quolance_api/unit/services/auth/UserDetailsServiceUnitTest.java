package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceUnitTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .password("encoded_password")
                .build();
    }

    @Test
    void loadUserByUsername_Success() {
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        UserDetails result = userDetailsService.loadUserByUsername(mockUser.getEmail());

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(mockUser.getEmail());
        verify(userRepository).findByEmail(mockUser.getEmail());
    }

    @Test
    void loadUserByUsername_UserNotFound_ThrowsException() {
        String email = "nonexistent@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername(email))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Cannot find user with email " + email);

        verify(userRepository).findByEmail(email);
    }
}