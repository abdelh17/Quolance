package com.quolance.quolance_api.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for updating the password and role of a PENDING user.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UpdatePendingUserRequestDto extends UpdateUserPasswordRequestDto {

    @NotBlank(message = "Role is required")
    private String role;
}
