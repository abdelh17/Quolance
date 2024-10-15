package com.quolance.quolance_api.services;

import com.quolance.quolance_api.entities.User;

import java.util.Optional;

public interface UserService {
    User save(User user);

    Optional<User> findByEmail(String email);
}
