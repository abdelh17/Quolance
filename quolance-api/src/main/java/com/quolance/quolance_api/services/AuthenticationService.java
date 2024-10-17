package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.LoginResponseDto;
import com.quolance.quolance_api.dtos.UserLoginDto;
import com.quolance.quolance_api.dtos.UserRegistrationDto;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {

    LoginResponseDto authenticate(UserLoginDto userLoginDto, HttpServletResponse httpServletResponse);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException, java.io.IOException;

    UserRegistrationDto signup(UserRegistrationDto input);

}
