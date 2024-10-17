package com.quolance.quolance_api.services.auth;

import com.quolance.quolance_api.dtos.LoginResponseDto;
import com.quolance.quolance_api.dtos.UserDto;
import com.quolance.quolance_api.dtos.UserLoginDto;
import com.quolance.quolance_api.dtos.UserRegistrationDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.AuthenticationService;
import com.quolance.quolance_api.services.UserService;
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
        user.setRole(Role.valueOf(userRegistrationDto.getUserType()));

        userService.save(user);
        userRegistrationDto.setPassword("");
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
}
