package com.quolance.quolance_api.dtos.users;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserDto {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("email")
    @NotBlank(message = "The email is required")
    private String email;

    @JsonProperty("first_name")
    @NotBlank(message = "The first name is required")
    private String firstName;

    @JsonProperty("last_name")
    @NotBlank(message = "The last name is required")
    private String lastName;

    @JsonProperty("role")
    @NotBlank(message = "The user role is required")
    private Role role;


    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}
