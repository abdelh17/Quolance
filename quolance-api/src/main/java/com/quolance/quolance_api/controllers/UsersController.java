package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.dtos.users.*;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
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
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<UserResponseDto> create(@Valid @RequestBody CreateUserRequestDto request) {
        log.info("Creating a new user with email {}", request.getEmail());
        UserResponseDto user = userService.create(request);
        log.info("User with email {} created successfully", request.getEmail());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/admin")
    @Operation(
            summary = "Create an admin",
            description = "Create a new user with admin role. Only available to authenticated admins."
    )
    @ApiResponse(responseCode = "200", description = "Admin created successfully")
    public ResponseEntity<UserResponseDto> createAdmin(@Valid @RequestBody CreateAdminRequestDto request) {
        User admin = SecurityUtil.getAuthenticatedUser();
        log.info("Admin with ID {} attempting to create a new admin with email {}", admin.getId(), request.getEmail());
        UserResponseDto user = userService.createAdmin(request);
        log.info("Admin with ID {} successfully created a new admin with email {}", admin.getId(), request.getEmail());
        return ResponseEntity.ok(user);
    }


    @PostMapping("/forgot-password/{email}")
    @Operation(summary = "Request a password reset email")
    public ResponseEntity<Void> requestForgotPassword(@PathVariable String email) {
        userService.forgotPassword(email);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reset-forgotten-password/{email}")
    public ResponseEntity<Void> resetForgottenPassword(@PathVariable String email,
                                                       @Valid @RequestBody ResetForgottenPasswordDto requestDTO) {
        log.info("Trying to reset password for: "+ email);
        userService.resetForgottenPassword(email, requestDTO);
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
        User user = SecurityUtil.getAuthenticatedUser();
        UserResponseDto userResponse = userService.updateUser(request, user);
        return ResponseEntity.ok(userResponse);
    }

    @PatchMapping("/password")
    @Operation(
            summary = "Update the password of an existing user",
            description = "Update the password of an existing user by passing the UpdateUserPasswordRequestDto. Only allowed with the correct old password. The field passwordResetToken is not required.")
    public ResponseEntity<UserResponseDto> updatePassword(
            @Valid @RequestBody UpdateUserPasswordRequestDto requestDTO) {
        User user = SecurityUtil.getAuthenticatedUser();
        UserResponseDto userResponseDto = userService.updatePassword(requestDTO, user);
        return ResponseEntity.ok(userResponseDto);
    }

    @PatchMapping("/notifications")
    @Operation(
            summary = "Update notifications subscription preference",
            description = "Update the notifications subscription preference for the authenticated user."
    )
    public ResponseEntity<Void> updateNotificationSubscription(@RequestBody Map<String, Boolean> payload) {
        User user = SecurityUtil.getAuthenticatedUser();
        boolean subscribed = payload.getOrDefault("subscribed", true);
        userService.updateNotificationSubscription(user, subscribed);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notifications/status")
    @Operation(
            summary = "Get notifications subscription status",
            description = "Returns the notifications subscription status for the authenticated user."
    )
    public ResponseEntity<NotificationSubscriptionResponseDto> getNotificationSubscriptionStatus() {
        User user = SecurityUtil.getAuthenticatedUser();
        NotificationSubscriptionResponseDto dto = new NotificationSubscriptionResponseDto(user);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete() {
        User user = SecurityUtil.getAuthenticatedUser();
        userService.deleteUser(user);
        return ResponseEntity.ok().build();
    }

}
