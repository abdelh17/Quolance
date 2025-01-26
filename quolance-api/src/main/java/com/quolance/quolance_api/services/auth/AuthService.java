package com.quolance.quolance_api.services.auth;

import com.quolance.quolance_api.dtos.users.LoginRequestDto;
import com.quolance.quolance_api.dtos.users.UserResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.transaction.annotation.Transactional;

public interface AuthService {

    /**
     * Authenticates a user and sets a session cookie if the credentials are correct.
     *
     * @param request  the HTTP request
     * @param response the HTTP response
     * @param body     the login request containing username and password
     * @throws AuthenticationException if authentication fails
     */
    void login(HttpServletRequest request, HttpServletResponse response, LoginRequestDto body) throws AuthenticationException;

    /**
     * Retrieves the session information for the currently authenticated user.
     *
     * @param request the HTTP request
     * @return UserResponse containing user information and authorities
     */
    @Transactional
    UserResponseDto getSession(HttpServletRequest request);

    /**
     * Logs out the current user, invalidating the session and removing the authentication context.
     *
     * @param request  the HTTP request
     * @param response the HTTP response
     */
    void logout(HttpServletRequest request, HttpServletResponse response);
}
