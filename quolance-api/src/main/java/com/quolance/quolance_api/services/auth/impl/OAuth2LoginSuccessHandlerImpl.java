package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.UserConnectedAccount;
import com.quolance.quolance_api.repositories.ConnectedAccountRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.auth.OAuth2LoginSuccessHandler;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Optional;

/**
 * Implementation of the OAuth2LoginSuccessHandler interface, handling the logic
 * for processing successful OAuth2 authentication events. This includes user creation,
 * user authentication, and associating OAuth2 connected accounts with users.
 */
@Component
@Slf4j
public class OAuth2LoginSuccessHandlerImpl implements OAuth2LoginSuccessHandler {

    private final ConnectedAccountRepository connectedAccountRepository;
    private final ApplicationProperties applicationProperties;
    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandlerImpl(ApplicationProperties applicationProperties,
                                         UserRepository userRepository,
                                         ConnectedAccountRepository connectedAccountRepository) {
        this.applicationProperties = applicationProperties;
        this.userRepository = userRepository;
        this.connectedAccountRepository = connectedAccountRepository;
    }

    /**
     * Handles the OAuth2 authentication success event. It checks if the authenticated user
     * has a connected account in the system. If a connected account exists, the user is authenticated.
     * Otherwise, a new user and connected account are created and then authenticated.
     *
     * @param request        the HTTP request
     * @param response       the HTTP response
     * @param authentication the authentication object containing OAuth2 details
     * @throws IOException if an error occurs during redirection
     */
    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken authenticationToken = (OAuth2AuthenticationToken) authentication;
        String provider = authenticationToken.getAuthorizedClientRegistrationId();
        String providerId = authentication.getName();
        String email = authenticationToken.getPrincipal().getAttribute("email");

        // Check if we have the user based on a connected account (provider / providerId)
        Optional<UserConnectedAccount> connectedAccount = connectedAccountRepository.findByProviderAndProviderId(provider, providerId);
        if (connectedAccount.isPresent()) {
            // Authenticate the existing user
            authenticateUser(connectedAccount.get().getUser(), response);
            return;
        }

        // If no connected account exists, find or create the user
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null) {
            // Link the connected account to the existing user
            UserConnectedAccount newConnectedAccount = new UserConnectedAccount(provider, providerId, existingUser);
            existingUser.addConnectedAccount(newConnectedAccount);
            userRepository.save(existingUser);
            connectedAccountRepository.save(newConnectedAccount);
            authenticateUser(existingUser, response);
        } else {
            // Create a new user and authenticate
            User newUser = createUserFromOauth2User(authenticationToken);
            authenticateUser(newUser, response);
        }
    }

    /**
     * Authenticates the provided user and sets the authentication in the security context.
     * Redirects the user to the login success URL after authentication.
     *
     * @param user     the user to authenticate
     * @param response the HTTP response
     * @throws IOException if an error occurs during redirection
     */
    private void authenticateUser(User user, HttpServletResponse response) throws IOException {
        // Create an authentication token for the user
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(token);

        // Redirect to the login success URL
        response.sendRedirect(applicationProperties.getLoginSuccessUrl());
    }

    /**
     * Creates a new user from the OAuth2 authentication token. The method extracts user
     * information from the token and links the user to a new connected account. A default
     * password ("oauth") is assigned to maintain non-null password integrity.
     *
     * @param authentication the OAuth2 authentication token
     * @return the newly created user
     */
    private User createUserFromOauth2User(OAuth2AuthenticationToken authentication) {
        // Retrieve the PasswordEncoder from the application context
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);

        // Initialize the user entity with attributes from the authentication token
        User user = new User(authentication.getPrincipal());

        // Set the default "oauth" password, encoded
        user.setPassword(passwordEncoder.encode("oauth"));

        String provider = authentication.getAuthorizedClientRegistrationId();
        String providerId = authentication.getName();

        // Create and link the connected account
        UserConnectedAccount connectedAccount = new UserConnectedAccount(provider, providerId, user);
        user.addConnectedAccount(connectedAccount);

        // Save the user and connected account to the database
        userRepository.save(user);
        connectedAccountRepository.save(connectedAccount);

        return user;
    }
}