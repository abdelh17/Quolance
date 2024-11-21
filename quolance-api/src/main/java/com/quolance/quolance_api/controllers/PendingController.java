package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.UpdatePendingUserRequestDto;
import com.quolance.quolance_api.dtos.UserResponseDto;
import com.quolance.quolance_api.services.auth.PendingWorkflowService;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/pending")
@RequiredArgsConstructor
public class PendingController {

    private final PendingWorkflowService pendingWorkflowService;

    /**
     * Updates password and role for a PENDING user in a single request.
     *
     * @param updatePendingUserDto DTO containing the new password and role.
     * @return Response entity with the updated user details.
     */
    @PostMapping("/update")
    @Operation(
            summary = "Update password and role for PENDING user",
            description = "Allows a PENDING user to set their password and choose a role (CLIENT or FREELANCER) in a single request"
    )
    public ResponseEntity<UserResponseDto> updatePendingUser(
            @Valid @RequestBody UpdatePendingUserRequestDto updatePendingUserDto) {
        User user = SecurityUtil.getAuthenticatedUser();
        UserResponseDto updatedUser = pendingWorkflowService.updatePendingUser(user, updatePendingUserDto);
        return ResponseEntity.ok(updatedUser);
    }
}
