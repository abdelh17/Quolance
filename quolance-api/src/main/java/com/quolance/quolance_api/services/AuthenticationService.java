package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.UserRegistrationDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.UserType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public User signup(UserRegistrationDto input) {
        User user = new User();
        user.setEmail(input.getEmail());
        user.setFirstName(input.getFirstName());
        user.setLastName(input.getLastName());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setUserType(UserType.valueOf(input.getUserType()));

        return userService.save(user);
    }
}
