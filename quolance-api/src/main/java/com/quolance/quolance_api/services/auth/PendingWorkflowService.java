package com.quolance.quolance_api.services.auth;

import com.quolance.quolance_api.dtos.users.UpdatePendingUserRequestDto;
import com.quolance.quolance_api.dtos.users.UserResponseDto;
import com.quolance.quolance_api.entities.User;

public interface PendingWorkflowService {

    /**
     * Updates the password and role of a PENDING user.
     *
     * @param user                 The authenticated user.
     * @param updatePendingUserDto DTO containing the new password and role.
     * @return Updated user response DTO.
     */
    UserResponseDto updatePendingUser(User user, UpdatePendingUserRequestDto updatePendingUserDto);
}
