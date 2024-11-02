package com.quolance.quolance_api.services.auth;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.UserConnectedAccount;
import com.quolance.quolance_api.repositories.ConnectedAccountRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.OAuth2LoginSuccessHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Optional;

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
            authenticateUser(connectedAccount.get().getUser(), response);
            return;
        }

        // If no connected account, find or create the user
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null) {
            UserConnectedAccount newConnectedAccount = new UserConnectedAccount(provider, providerId, existingUser);
            existingUser.addConnectedAccount(newConnectedAccount);
            userRepository.save(existingUser);
            connectedAccountRepository.save(newConnectedAccount);
            authenticateUser(existingUser, response);
        } else {
            User newUser = createUserFromOauth2User(authenticationToken);
            authenticateUser(newUser, response);
        }
    }

    private void authenticateUser(User user, HttpServletResponse response) throws IOException {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(token);
        response.sendRedirect(applicationProperties.getLoginSuccessUrl());
    }

    private User createUserFromOauth2User(OAuth2AuthenticationToken authentication) {
        User user = new User(authentication.getPrincipal());
        String provider = authentication.getAuthorizedClientRegistrationId();
        String providerId = authentication.getName();
        UserConnectedAccount connectedAccount = new UserConnectedAccount(provider, providerId, user);
        user.addConnectedAccount(connectedAccount);
        userRepository.save(user);
        connectedAccountRepository.save(connectedAccount);
        return user;
    }
}
