package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.util.validators.PasswordMatch;
import com.quolance.quolance_api.util.validators.Unique;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

@Data
@PasswordMatch(passwordField = "password", passwordConfirmationField = "passwordConfirmation")
@SuperBuilder
@AllArgsConstructor
public class CreateUserRequestDto {
    @Email
    @Unique(columnName = "email", tableName = "user", message = "User with this email already exists")
    private String email;
    @NotNull
    @Length(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "must contain at least one uppercase letter, one lowercase letter, and one digit.")
    private String password;
    private String passwordConfirmation;
    private String firstName;
    private String lastName;
}
