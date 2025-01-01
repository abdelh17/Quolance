package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.util.validators.PasswordMatch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

@Data
@PasswordMatch(passwordField = "password", passwordConfirmationField = "passwordConfirmation")
@SuperBuilder
@AllArgsConstructor
public class CreateUserRequestDto {

    @Email
    private String email;

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "username must contain only letters and numbers")
    @Length(min = 5, max = 50, message = "username must be between 5 and 50 characters")
    private String username;

    @NotNull
    @Length(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "must contain at least one uppercase letter, one lowercase letter, and one digit.")
    private String password;

    private String passwordConfirmation;

    private String firstName;

    private String lastName;

    private String role;
}
