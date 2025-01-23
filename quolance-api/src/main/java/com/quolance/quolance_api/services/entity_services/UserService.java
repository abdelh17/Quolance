package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.*;
import com.quolance.quolance_api.entities.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;

public interface UserService {

    UserResponseDto create(@Valid CreateUserRequestDto request);

    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    void verifyEmail(String code);

    void forgotPassword(String email);

    void resetPassword(UpdateUserPasswordRequestDto request);

    UserResponseDto updateUser(UpdateUserRequestDto request, User user);

    void updateUserName(String username, User user);

    UserResponseDto updatePassword(UpdateUserPasswordRequestDto request, User user);

    UserResponseDto createAdmin(@Valid CreateAdminRequestDto request);

    void updateProfilePicture(User user, String photoUrl);

    Page<User> findAllWithFilters(Specification<User> spec, Pageable pageable);

}
