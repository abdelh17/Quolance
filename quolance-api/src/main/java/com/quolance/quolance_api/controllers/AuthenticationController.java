package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.LoginResponseDto;
import com.quolance.quolance_api.dtos.UserLoginDto;
import com.quolance.quolance_api.dtos.UserRegistrationDto;
import com.quolance.quolance_api.services.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RequestMapping("api/auth")
@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @Operation(
            summary = "Create a new user (client/freelancer)",

            description = "Create a new user by passing a UserRegistrationDto"
    )
    public ResponseEntity<UserRegistrationDto> register(@RequestBody UserRegistrationDto userRegistrationDto) {
        UserRegistrationDto registrationDto = authenticationService.signup(userRegistrationDto);
        return ResponseEntity.ok(registrationDto);
    }

    @PostMapping("/login")
    @Operation(
            summary = "Authenticate a user",
            description = "Authenticate a user to get back an access token and a refresh token"
    )
    public ResponseEntity<LoginResponseDto> authenticate(@RequestBody UserLoginDto userLoginDto, HttpServletResponse httpServletResponse) {
        LoginResponseDto loginResponseDto = authenticationService.authenticate(userLoginDto, httpServletResponse);
        return ResponseEntity.ok(loginResponseDto);
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        authenticationService.refreshToken(request, response);
    }

}
