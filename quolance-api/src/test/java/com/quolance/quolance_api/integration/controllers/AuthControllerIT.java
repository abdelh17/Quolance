//package com.quolance.quolance_api.integration.controllers;
//
//import com.quolance.quolance_api.dtos.LoginRequestDto;
//import com.quolance.quolance_api.dtos.UserResponseDto;
//import com.quolance.quolance_api.entities.User;
//import com.quolance.quolance_api.repositories.UserRepository;
//import com.quolance.quolance_api.util.TestDataBuilder;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.web.client.TestRestTemplate;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.context.ActiveProfiles;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@ActiveProfiles("test")
//public class AuthControllerIT {
//
//    @Autowired
//    private TestRestTemplate restTemplate;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    private User testUser;
//
//    @BeforeEach
//    void setUp() {
//        userRepository.deleteAll();
//        testUser = TestDataBuilder.createTestClient();
//        userRepository.save(testUser);
//    }
//
//    @Test
//    void loginSuccess() {
//        LoginRequestDto request = new LoginRequestDto();
//        request.setEmail(testUser.getEmail());
//        request.setPassword("Password123!");
//
//        ResponseEntity<?> response = restTemplate.postForEntity("/api/auth/login", request, Void.class);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//    }
//
//    @Test
//    void loginFailureWithInvalidCredentials() {
//        LoginRequestDto request = new LoginRequestDto();
//        request.setEmail(testUser.getEmail());
//        request.setPassword("WrongPassword!");
//
//        ResponseEntity<?> response = restTemplate.postForEntity("/api/auth/login", request, Void.class);
//
//        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
//    }
//
//    @Test
//    void getMeSuccess() {
//        // First login
//        LoginRequestDto loginRequest = new LoginRequestDto();
//        loginRequest.setEmail(testUser.getEmail());
//        loginRequest.setPassword("Password123!");
//        restTemplate.postForEntity("/api/auth/login", loginRequest, Void.class);
//
//        // Then get session
//        ResponseEntity<UserResponseDto> response = restTemplate.getForEntity("/api/auth/me", UserResponseDto.class);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertNotNull(response.getBody());
//        assertEquals(testUser.getEmail(), response.getBody().getEmail());
//    }
//
//    @Test
//    void logoutSuccess() {
//        // First login
//        LoginRequestDto loginRequest = new LoginRequestDto();
//        loginRequest.setEmail(testUser.getEmail());
//        loginRequest.setPassword("Password123!");
//        restTemplate.postForEntity("/api/auth/login", loginRequest, Void.class);
//
//        // Then logout
//        ResponseEntity<?> response = restTemplate.postForEntity("/api/auth/logout", null, Void.class);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//
//        // Verify session is invalidated by trying to access /me
//        ResponseEntity<UserResponseDto> meResponse = restTemplate.getForEntity("/api/auth/me", UserResponseDto.class);
//        assertEquals(HttpStatus.UNAUTHORIZED, meResponse.getStatusCode());
//    }
//}