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
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<UserResponseDto> create(@Valid @RequestBody CreateUserRequestDto request) {
        UserResponseDto user = userService.create(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/admin")
    @Operation(
            summary = "Create an admin",
            description = "Create a new user with admin role. Only available to authenticated admins."
    )
    @ApiResponse(responseCode = "200", description = "Admin created successfully")
    public ResponseEntity<UserResponseDto> createAdmin(@Valid @RequestBody CreateAdminRequestDto request) {
        UserResponseDto user = userService.createAdmin(request);
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

}
