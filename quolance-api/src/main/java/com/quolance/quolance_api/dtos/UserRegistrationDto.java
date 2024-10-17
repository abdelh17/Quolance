package com.quolance.quolance_api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.SuperBuilder;


@Data
@SuperBuilder
@AllArgsConstructor
public class UserRegistrationDto {
    @JsonProperty("email")
    @NotBlank(message = "The email is required")
    private String email;

    @JsonProperty("password")
    @NotBlank(message = "The password is required")
    private String password;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("role")
    private String role;
}
