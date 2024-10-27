package com.quolance.quolance_api.services.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginResponseDto;
import com.quolance.quolance_api.dtos.UserDto;
import com.quolance.quolance_api.dtos.UserLoginDto;
import com.quolance.quolance_api.dtos.UserRegistrationDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.AuthenticationService;
import com.quolance.quolance_api.services.UserService;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public UserRegistrationDto signup(UserRegistrationDto userRegistrationDto) {
        User user = new User();
        user.setEmail(userRegistrationDto.getEmail());
        user.setFirstName(userRegistrationDto.getFirstName());
        user.setLastName(userRegistrationDto.getLastName());
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setRole(Role.valueOf(userRegistrationDto.getRole()));

        userService.createUser(user);
        userRegistrationDto.setPassword("");

        //TODO: Send Verification Email

        return userRegistrationDto;
    }

    public LoginResponseDto authenticate(UserLoginDto userLoginDto, HttpServletResponse httpServletResponse) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginDto.getEmail(),
                        userLoginDto.getPassword())
        );

        User authenticatedUser = userService.findByEmail(userLoginDto.getEmail()).orElseThrow();

        String accessToken = jwtService.generateToken(authenticatedUser, false);
        String refreshToken = jwtService.generateToken(authenticatedUser, true);

        jwtService.addTokensAsCookies(httpServletResponse, accessToken, refreshToken);

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setAccessToken(accessToken);
        loginResponseDto.setRefreshToken(refreshToken);
        loginResponseDto.setExpiresIn(jwtService.getExpirationTime());
        loginResponseDto.setUser(UserDto.fromEntity(authenticatedUser));
        return loginResponseDto;
    }


    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException, java.io.IOException {
        Cookie[] cookies = request.getCookies();

        String refreshToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String userEmail = jwtService.extractUsername(refreshToken);

        User user = userService.findByEmail(userEmail).orElseThrow();

        String accessToken = jwtService.generateToken(user, false);
        String newRefreshToken = jwtService.generateToken(user, true);

        jwtService.addTokensAsCookies(response, accessToken, newRefreshToken);

        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setAccessToken(accessToken);
        loginResponseDto.setRefreshToken(refreshToken);
        loginResponseDto.setExpiresIn(jwtService.getExpirationTime());
        loginResponseDto.setUser(UserDto.fromEntity(user));

        new ObjectMapper().writeValue(response.getOutputStream(), loginResponseDto);
    }





}
