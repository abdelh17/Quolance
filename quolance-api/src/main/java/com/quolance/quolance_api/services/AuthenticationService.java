package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.LoginResponseDto;
import com.quolance.quolance_api.dtos.UserLoginDto;
import com.quolance.quolance_api.dtos.UserRegistrationDto;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {
    UserRegistrationDto signup(UserRegistrationDto input);

    LoginResponseDto authenticate(UserLoginDto userLoginDto, HttpServletResponse httpServletResponse);
}
