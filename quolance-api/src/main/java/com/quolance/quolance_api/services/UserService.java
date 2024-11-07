package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.*;
import com.quolance.quolance_api.entities.User;
import jakarta.validation.Valid;

import java.util.Optional;

public interface UserService {

    UserResponseDto create(@Valid CreateUserRequestDto request);

    Optional<User> findById(Long id);

    void verifyEmail(String code);

    void forgotPassword(String email);

    void resetPassword(UpdateUserPasswordRequestDto request);

    UserResponseDto updateUser(UpdateUserRequestDto request, User user);

    UserResponseDto updatePassword(UpdateUserPasswordRequestDto request, User user);

    UserResponseDto createAdmin(@Valid CreateAdminRequestDto request);
}
