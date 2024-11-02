package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.dtos.*;
import com.quolance.quolance_api.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
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

    @PostMapping
    @Operation(
            summary = "Create a new user",
            description = "Create a new user by passing a CreateUserRequestDto"
    )
    public ResponseEntity<UserResponseDto> create(@Valid @RequestBody CreateUserRequestDto request) {
        UserResponseDto user = userService.create(request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/verify-email")
    @Operation(
            summary = "Verify the email of the user",
            description = "Verify the email of the user by passing the token")
    public RedirectView verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return new RedirectView(applicationProperties.getLoginPageUrl());
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset email")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto req) {
        userService.forgotPassword(req.getEmail());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reset-password")
    @Operation(
            summary = "Reset user password",
            description = "Reset user password by passing the UpdateUserPasswordRequestDto. Only allowed with the password reset token.")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody UpdateUserPasswordRequestDto requestDTO) {
        userService.resetPassword(requestDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping()
    @Operation(
            summary = "Update an existing user",
            description = "Update an existing user by passing the UpdateUserRequestDto. Only allowed to self.")
    public ResponseEntity<UserResponseDto> update(@Valid @RequestBody UpdateUserRequestDto request) {
        UserResponseDto user = userService.updateUser(request);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/password")
    @Operation(
            summary = "Update the password of an existing user",
            description = "Update the password of an existing user by passing the UpdateUserPasswordRequestDto. Only allowed with the correct old password.")
    public ResponseEntity<UserResponseDto> updatePassword(
            @Valid @RequestBody UpdateUserPasswordRequestDto requestDTO) {
        UserResponseDto user = userService.updatePassword(requestDTO);
        return ResponseEntity.ok(user);
    }

}
