package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.LoginResponseDto;
import com.quolance.quolance_api.dtos.UserLoginDto;
import com.quolance.quolance_api.dtos.UserRegistrationDto;
import com.quolance.quolance_api.services.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/auth")
@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationDto> register(@RequestBody UserRegistrationDto userRegistrationDto) {
        UserRegistrationDto registrationDto = authenticationService.signup(userRegistrationDto);
        return ResponseEntity.ok(registrationDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> authenticate(@RequestBody UserLoginDto userLoginDto, HttpServletResponse httpServletResponse) {
        LoginResponseDto loginResponseDto = authenticationService.authenticate(userLoginDto, httpServletResponse);
        return ResponseEntity.ok(loginResponseDto);
    }

}
