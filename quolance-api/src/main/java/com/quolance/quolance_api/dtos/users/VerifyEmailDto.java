package com.quolance.quolance_api.dtos.users;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class VerifyEmailDto {
    @NotNull
    private String email;
    @NotNull
    private String verificationCode;
}
