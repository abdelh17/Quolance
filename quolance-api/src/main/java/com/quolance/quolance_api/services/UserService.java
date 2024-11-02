package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.CreateUserRequestDto;
import com.quolance.quolance_api.dtos.UpdateUserPasswordRequestDto;
import com.quolance.quolance_api.dtos.UpdateUserRequestDto;
import com.quolance.quolance_api.dtos.UserResponseDto;
import com.quolance.quolance_api.entities.User;
import jakarta.validation.Valid;

import java.util.Optional;

public interface UserService {

    UserResponseDto create(@Valid CreateUserRequestDto request);

    Optional<User> findById(Long id);

    void verifyEmail(String code);

    void forgotPassword(String email);

    void resetPassword(UpdateUserPasswordRequestDto request);

    UserResponseDto updateUser(UpdateUserRequestDto request);

    UserResponseDto updatePassword(UpdateUserPasswordRequestDto request);
}
