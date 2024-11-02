package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.dtos.*;
import com.quolance.quolance_api.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

    private final UserService userService;
    private final ApplicationProperties applicationProperties;

    /**
     * Register a new user. The user will be created with the default role USER. Verification email will
     * be sent to the user.
     */
    @PostMapping
    public ResponseEntity<UserResponseDto> create(@Valid @RequestBody CreateUserRequestDto request) {
        UserResponseDto user = userService.create(request);
        return ResponseEntity.ok(user);
    }


    /**
     * Verify the email of the user, redirect to the login page.
     */
    @GetMapping("/verify-email")
    public RedirectView verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return new RedirectView(applicationProperties.getLoginPageUrl());
    }

    /**
     * Request a password reset email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto req) {
        userService.forgotPassword(req.getEmail());
        return ResponseEntity.ok().build();
    }

    /**
     * Reset the password of an existing user, uses the password reset token
     * <p>
     * Only allowed with the password reset token
     */
    @PatchMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody UpdateUserPasswordRequestDto requestDTO) {
        userService.resetPassword(requestDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * Update an existing user.
     * <p>
     * Only allowed to self.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> update(@Valid @RequestBody UpdateUserRequestDto request) {
        UserResponseDto user = userService.update(request);
        return ResponseEntity.ok(user);
    }

    /**
     * Update the password of an existing user.
     * <p>
     * Only allowed with the correct old password
     */
    @PatchMapping("/password")
    public ResponseEntity<UserResponseDto> updatePassword(
            @Valid @RequestBody UpdateUserPasswordRequestDto requestDTO) {
        UserResponseDto user = userService.updatePassword(requestDTO);
        return ResponseEntity.ok(user);
    }

}
