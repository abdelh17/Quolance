package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.UserRegistrationDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/auth")
@RestController
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody UserRegistrationDto userRegistrationDto) {
        User registeredUser = authenticationService.signup(userRegistrationDto);

        return ResponseEntity.ok(registeredUser);
    }

}
