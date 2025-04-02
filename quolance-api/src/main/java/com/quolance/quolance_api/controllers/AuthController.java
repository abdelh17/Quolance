package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.users.LoginRequestDto;
import com.quolance.quolance_api.dtos.users.UserResponseDto;
import com.quolance.quolance_api.dtos.users.VerifyEmailDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.auth.AuthService;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final UserService userService;


    @PostMapping("/login")
    public ResponseEntity<Void> login(
            HttpServletRequest request, HttpServletResponse response, @Valid @RequestBody LoginRequestDto body) {
        authService.login(request, response, body);
        User user = SecurityUtil.getAuthenticatedUser();
        log.info("User with ID {} logged in", user.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getSession(HttpServletRequest request) {
        return ResponseEntity.ok(authService.getSession(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        User user = SecurityUtil.getAuthenticatedUser();
        authService.logout(request, response);
        log.info("User with ID {} logged out", user.getId());
        return ResponseEntity.ok().build();
    }

    /**
     * We don't have to do anything in this endpoint, the CsrfFilter will handle it.
     * This endpoint should be invoked by the frontend to get the CSRF token.
     */
    @GetMapping("/csrf")
    public ResponseEntity<Void> csrf() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-email/{email}")
    @Operation(summary = "Verify the email of the user")
    public ResponseEntity<String> verifyEmail(@PathVariable String email, @RequestBody VerifyEmailDto verificationDto) {
        String verificationResponse = userService.verifyEmail(email, verificationDto);
        return ResponseEntity.ok(verificationResponse);
    }

    @PostMapping("/resend-verification/{email}")
    @Operation(
            summary = "Resend verification code"
    )
    public ResponseEntity<String> resendVerificationEmail(@PathVariable String email) {
        userService.resendVerificationEmail(email);
        return ResponseEntity.ok("Code sent successfully");
    }
}
