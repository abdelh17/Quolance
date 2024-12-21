package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.UserResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private SecurityContextRepository securityContextRepository;

    @Mock
    private SecurityContextLogoutHandler logoutHandler;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthServiceImpl authService;

    private User mockUser;
    private LoginRequestDto loginRequest;
    private List<SimpleGrantedAuthority> authorities;

    @BeforeEach
    void setUp() throws Exception {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .password("encoded_password")
                .firstName("Test")
                .lastName("User")
                .role(Role.CLIENT)
                .verified(true)
                .connectedAccounts(new ArrayList<>())
                .build();

        loginRequest = LoginRequestDto.builder()
                .email("test@test.com")
                .password("Password123")
                .build();

        authorities = List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));

        SecurityContextHolder.clearContext();

        java.lang.reflect.Field contextRepoField = AuthServiceImpl.class.getDeclaredField("securityContextRepository");
        contextRepoField.setAccessible(true);
        contextRepoField.set(authService, securityContextRepository);

        java.lang.reflect.Field logoutHandlerField = AuthServiceImpl.class.getDeclaredField("logoutHandler");
        logoutHandlerField.setAccessible(true);
        logoutHandlerField.set(authService, logoutHandler);
    }

    @Test
    void login_Success() {
        SecurityContextHolderStrategy contextHolderStrategy = mock(SecurityContextHolderStrategy.class);
        when(contextHolderStrategy.createEmptyContext()).thenReturn(securityContext);
        SecurityContextHolder.setContextHolderStrategy(contextHolderStrategy);

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(mockUser, null, authorities));

        authService.login(request, response, loginRequest);

        verify(authenticationManager).authenticate(any(Authentication.class));
        verify(securityContextRepository).saveContext(any(SecurityContext.class), eq(request), eq(response));
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThatThrownBy(() -> authService.login(request, response, loginRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Invalid credentials");
    }

    @Test
    void getSession_Success() {
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(authentication.getAuthorities()).thenReturn((Collection) authorities);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        UserResponseDto result = authService.getSession(request);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(mockUser.getId());
        assertThat(result.getEmail()).isEqualTo(mockUser.getEmail());
        assertThat(result.getRole()).isEqualTo(mockUser.getRole());
        assertThat(result.getAuthorities()).hasSize(1);
        assertThat(result.getAuthorities().get(0)).isEqualTo("ROLE_CLIENT");
    }

    @Test
    void getSession_NoAuthenticatedUser_ThrowsException() {
        when(authentication.getPrincipal()).thenReturn("anonymousUser");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        assertThatThrownBy(() -> authService.getSession(request))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 401)
                .hasMessage("Authentication required");
    }

    @Test
    void logout_Success() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        authService.logout(request, response);

        verify(logoutHandler).logout(request, response, authentication);
    }

    @Test
    void logout_NoAuthenticatedUser_StillCallsLogoutHandler() {
        when(securityContext.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);

        authService.logout(request, response);

        verify(logoutHandler).logout(request, response, null);
    }
}