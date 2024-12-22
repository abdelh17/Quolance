package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.UserConnectedAccount;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.ConnectedAccountRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OAuth2LoginSuccessHandlerUnitTest {

    @Mock
    private ConnectedAccountRepository connectedAccountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private OAuth2LoginSuccessHandlerImpl oAuth2LoginSuccessHandler;

    private OAuth2AuthenticationToken authenticationToken;
    private User mockUser;
    private UserConnectedAccount mockConnectedAccount;

    @BeforeEach
    void setUp() {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("email", "test@example.com");
        attributes.put("name", "Test User");

        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        DefaultOAuth2User oAuth2User = new DefaultOAuth2User(
                authorities,
                attributes,
                "email"
        );

        authenticationToken = new OAuth2AuthenticationToken(
                oAuth2User,
                authorities,
                "google"
        );

        mockUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .role(Role.CLIENT)
                .connectedAccounts(new ArrayList<>())
                .build();

        mockConnectedAccount = new UserConnectedAccount("google", authenticationToken.getName(), mockUser);
        when(applicationProperties.getLoginSuccessUrl()).thenReturn("/dashboard");
    }

    @Test
    void onAuthenticationSuccess_ExistingConnectedAccount_AuthenticatesAndRedirects() throws IOException {
        try (MockedStatic<SecurityContextHolder> securityContextHolder = mockStatic(SecurityContextHolder.class)) {
            securityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext);

            when(connectedAccountRepository.findByProviderAndProviderId("google", authenticationToken.getName()))
                    .thenReturn(Optional.of(mockConnectedAccount));

            oAuth2LoginSuccessHandler.onAuthenticationSuccess(request, response, authenticationToken);

            verify(response).sendRedirect("/dashboard");
            verify(connectedAccountRepository).findByProviderAndProviderId("google", authenticationToken.getName());
            verifyNoMoreInteractions(userRepository);
        }
    }

    @Test
    void onAuthenticationSuccess_ExistingUserNoConnectedAccount_LinksAccountAndAuthenticates() throws IOException {
        try (MockedStatic<SecurityContextHolder> securityContextHolder = mockStatic(SecurityContextHolder.class)) {
            securityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext);

            when(connectedAccountRepository.findByProviderAndProviderId("google", authenticationToken.getName()))
                    .thenReturn(Optional.empty());
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));

            oAuth2LoginSuccessHandler.onAuthenticationSuccess(request, response, authenticationToken);

            verify(userRepository).save(mockUser);
            verify(connectedAccountRepository).save(any(UserConnectedAccount.class));
            verify(response).sendRedirect("/dashboard");
        }
    }

    @Test
    void onAuthenticationSuccess_NewUser_CreatesUserAndAuthenticates() throws IOException {
        try (MockedStatic<SecurityContextHolder> securityContextHolder = mockStatic(SecurityContextHolder.class);
             MockedStatic<ApplicationContextProvider> applicationContextProvider = mockStatic(ApplicationContextProvider.class)) {

            securityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            applicationContextProvider.when(() -> ApplicationContextProvider.bean(PasswordEncoder.class))
                    .thenReturn(passwordEncoder);

            when(connectedAccountRepository.findByProviderAndProviderId("google", authenticationToken.getName()))
                    .thenReturn(Optional.empty());
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setId(1L);
                return user;
            });

            oAuth2LoginSuccessHandler.onAuthenticationSuccess(request, response, authenticationToken);

            verify(userRepository).save(any(User.class));
            verify(connectedAccountRepository).save(any(UserConnectedAccount.class));
            verify(response).sendRedirect("/dashboard");
        }
    }

    @Test
    void onAuthenticationSuccess_RedirectError_PropagatesException() throws IOException {
        try (MockedStatic<SecurityContextHolder> securityContextHolder = mockStatic(SecurityContextHolder.class)) {
            securityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext);

            when(connectedAccountRepository.findByProviderAndProviderId("google", authenticationToken.getName()))
                    .thenReturn(Optional.of(mockConnectedAccount));
            doThrow(new IOException("Redirect failed")).when(response).sendRedirect("/dashboard");

            assertThrows(IOException.class, () ->
                    oAuth2LoginSuccessHandler.onAuthenticationSuccess(request, response, authenticationToken)
            );
        }
    }
}