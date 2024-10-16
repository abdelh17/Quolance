package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User save(User user) {
        if (findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email already exists");
        }
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}
