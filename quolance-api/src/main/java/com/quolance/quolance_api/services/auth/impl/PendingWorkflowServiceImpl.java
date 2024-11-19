package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.dtos.UpdatePendingUserRequestDto;
import com.quolance.quolance_api.dtos.UserResponseDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.auth.PendingWorkflowService;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PendingWorkflowServiceImpl implements PendingWorkflowService {

    private final UserRepository userRepository;

    /**
     * Updates the password and role of a PENDING user in a single operation.
     *
     * @param user                  The authenticated user.
     * @param updatePendingUserDto  DTO containing the new password and role.
     * @return Updated user response DTO.
     */
    @Override
    @Transactional
    public UserResponseDto updatePendingUser(User user, UpdatePendingUserRequestDto updatePendingUserDto) {
        // Validate the user's current role
        if (user.getRole() != Role.PENDING) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to update your role and password.")
                    .build();
        }

        // Validate and set the new role
        Role newRole;
        try {
            newRole = Role.valueOf(updatePendingUserDto.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Invalid role. Must be either CLIENT or FREELANCER.")
                    .build();
        }
        if (newRole != Role.CLIENT && newRole != Role.FREELANCER) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Invalid role. Must be either CLIENT or FREELANCER.")
                    .build();
        }
        user.setRole(newRole);

        // Encode and set the new password
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        user.setPassword(passwordEncoder.encode(updatePendingUserDto.getPassword()));

        // Save the updated user to the database
        User updatedUser = userRepository.save(user);

        // Convert the updated user to a response DTO and return
        return new UserResponseDto(updatedUser);
    }
}
