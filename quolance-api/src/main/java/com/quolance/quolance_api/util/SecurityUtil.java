package com.quolance.quolance_api.util;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public class SecurityUtil {
    public static User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        } else {
            log.error("User requested but not found in SecurityContextHolder");
            throw ApiException.builder().status(HttpServletResponse.SC_UNAUTHORIZED).message("Authentication required").build();
        }
    }
}