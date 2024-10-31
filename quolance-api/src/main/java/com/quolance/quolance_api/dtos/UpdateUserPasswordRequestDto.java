package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.util.validators.PasswordMatch;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@PasswordMatch(passwordField = "password", passwordConfirmationField = "confirmPassword")
public class UpdateUserPasswordRequestDto {
    private String oldPassword;
    @NotNull
    @Length(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "must contain at least one uppercase letter, one lowercase letter, and one digit.")
    private String password;
    private String confirmPassword;
    private String passwordResetToken;
}
