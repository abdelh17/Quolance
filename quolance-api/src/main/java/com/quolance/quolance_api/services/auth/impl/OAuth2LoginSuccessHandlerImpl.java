package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.UserConnectedAccount;
import com.quolance.quolance_api.jobs.SendTempPasswordEmailJob;
import com.quolance.quolance_api.repositories.ConnectedAccountRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.auth.OAuth2LoginSuccessHandler;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.BackgroundJobRequest;
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
        log.info("OAuth2 authentication success handler triggered.");

        OAuth2AuthenticationToken authenticationToken = (OAuth2AuthenticationToken) authentication;
        String provider = authenticationToken.getAuthorizedClientRegistrationId();
        String providerId = authentication.getName();
        String email = authenticationToken.getPrincipal().getAttribute("email");

        log.info("Received OAuth2 authentication with provider: {}, providerId: {}, email: {}",
                provider, providerId, email);

        // Check if we have the user based on a connected account (provider / providerId)
        Optional<UserConnectedAccount> connectedAccount = connectedAccountRepository.findByProviderAndProviderId(provider, providerId);
        if (connectedAccount.isPresent()) {
            log.info("Connected account found for provider {} and providerId {}. Authenticating existing user.",
                    provider, providerId);
            authenticateUser(connectedAccount.get().getUser(), response);
            return;
        }

        // No connected account exists, check if user exists by email
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null) {
            log.info("Existing user found by email {}. Linking new connected account.", email);
            // Link the connected account to the existing user
            UserConnectedAccount newConnectedAccount = new UserConnectedAccount(provider, providerId, existingUser);
            existingUser.addConnectedAccount(newConnectedAccount);
            userRepository.save(existingUser);
            connectedAccountRepository.save(newConnectedAccount);
            log.info("Connected account linked for user id: {}", existingUser.getId());
            authenticateUser(existingUser, response);
        } else {
            log.info("No existing user found for email {}. Creating a new user.", email);
            // Create a new user and authenticate
            User newUser = createUserFromOauth2User(authenticationToken);
            log.info("New user created with id: {}", newUser.getId());
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
        log.info("Authenticating user with id: {}", user.getId());
        // Create an authentication token for the user
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(token);
        log.info("User with id: {} is now authenticated.", user.getId());

        // Redirect to the login success URL (public UI)
        response.sendRedirect(applicationProperties.getLoginSuccessUrl());
    }

    /**
     * Creates a new user from the OAuth2 authentication token. The method extracts user
     * information from the token, generates a random password, sends it to the user's email,
     * and links the user to a new connected account.
     *
     * @param authentication the OAuth2 authentication token
     * @return the newly created user
     */
    private User createUserFromOauth2User(OAuth2AuthenticationToken authentication) {
        log.info("Creating new user from OAuth2 token.");
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);

        // Initialize the user entity with attributes from the authentication token
        User user = new User(authentication.getPrincipal());
        log.debug("User details extracted: {}", user);

        // Generate a random 10-character password
        String randomPassword = generateRandomPassword(10);
        log.debug("Generated random password: {}", randomPassword);
        user.setPassword(passwordEncoder.encode(randomPassword));

        // Save the user to the database first
        userRepository.save(user);
        log.info("New user saved with id: {}", user.getId());

        // Enqueue the job to send the temporary password email
        enqueueTempPasswordEmailJob(user, randomPassword);
        log.info("Enqueued temporary password email job for user id: {}", user.getId());

        // Link the connected account
        String provider = authentication.getAuthorizedClientRegistrationId();
        String providerId = authentication.getName();
        log.info("Linking connected account for provider: {} and providerId: {}", provider, providerId);
        UserConnectedAccount connectedAccount = new UserConnectedAccount(provider, providerId, user);
        user.addConnectedAccount(connectedAccount);
        connectedAccountRepository.save(connectedAccount);
        log.info("Connected account saved for user id: {}", user.getId());

        return user;
    }

    /**
     * Enqueues a job to send the temporary password email.
     */
    private void enqueueTempPasswordEmailJob(User user, String tempPassword) {
        log.info("Enqueuing email job for user id: {} with temporary password.", user.getId());
        SendTempPasswordEmailJob sendTempPasswordEmailJob = new SendTempPasswordEmailJob(user.getId(), tempPassword);
        BackgroundJobRequest.enqueue(sendTempPasswordEmailJob);
    }

    /**
     * Generates a random password with the given length.
     *
     * @param length the desired length of the password
     * @return the generated password
     */
    private String generateRandomPassword(int length) {
        String allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = (int) (Math.random() * allowedChars.length());
            password.append(allowedChars.charAt(randomIndex));
        }
        return password.toString();
    }
}