package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.users.LoginRequestDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.helpers.SessionCreationHelper;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class AuthControllerIntegrationTest extends AbstractTestcontainers {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private User client, freelancer, admin;

    private MockHttpSession session;
    private SessionCreationHelper sessionCreationHelper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        client = userRepository.save(EntityCreationHelper.createClient());
        freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));
        admin = userRepository.save(EntityCreationHelper.createAdmin());

        sessionCreationHelper = new SessionCreationHelper(mockMvc, objectMapper);
    }

    @Test
    void testEmailLoginClientIsOk() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("client@test.com");
        loginRequest.setPassword("Password123!");

        // Act
        session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getRequest()
                .getSession();

        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");

        // Assert
        assertThat(securityContext).isNotNull();

        User principal = (User) securityContext.getAuthentication().getPrincipal();
        assertThat(principal.getEmail()).isEqualTo("client@test.com");
        assertThat(principal.getRole()).isEqualTo(Role.CLIENT);
        assertThat(principal.getFirstName()).isEqualTo("Client");
        assertThat(principal.getLastName()).isEqualTo("Test");
        assertThat(principal.getId()).isEqualTo(client.getId());
    }

    @Test
    void testUsernameLoginClientIsOk() throws Exception {
        // Act
        session = sessionCreationHelper.getSession(client.getEmail(), "Password123!");

        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");

        // Assert
        assertThat(securityContext).isNotNull();

        User principal = (User) securityContext.getAuthentication().getPrincipal();
        assertThat(principal.getUsername()).isEqualTo("MyClient123");
        assertThat(principal.getRole()).isEqualTo(Role.CLIENT);
        assertThat(principal.getFirstName()).isEqualTo("Client");
        assertThat(principal.getLastName()).isEqualTo("Test");
        assertThat(principal.getId()).isEqualTo(client.getId());
    }

    @Test
    void testEmailLoginFreelancerIsOk() throws Exception {
        // Act
        session = sessionCreationHelper.getSession(freelancer.getEmail(), "Password123!");

        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");

        // Assert
        assertThat(securityContext).isNotNull();

        User principal = (User) securityContext.getAuthentication().getPrincipal();
        assertThat(principal.getEmail()).isEqualTo("freelancer1@test.com");
        assertThat(principal.getRole()).isEqualTo(Role.FREELANCER);
        assertThat(principal.getFirstName()).isEqualTo("Freelancer1");
        assertThat(principal.getLastName()).isEqualTo("Test");
        assertThat(principal.getId()).isEqualTo(freelancer.getId());
    }

    @Test
    void testUsernameLoginFreelancerIsOk() throws Exception {
        // Act
        session = sessionCreationHelper.getSession(freelancer.getUsername(), "Password123!");

        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");

        // Assert
        assertThat(securityContext).isNotNull();

        User principal = (User) securityContext.getAuthentication().getPrincipal();
        assertThat(principal.getUsername()).isEqualTo("MyFreelancer1");
        assertThat(principal.getRole()).isEqualTo(Role.FREELANCER);
        assertThat(principal.getFirstName()).isEqualTo("Freelancer1");
        assertThat(principal.getLastName()).isEqualTo("Test");
        assertThat(principal.getId()).isEqualTo(freelancer.getId());
    }

    @Test
    void testLoginAdminIsOk() throws Exception {
        // Act
        session = sessionCreationHelper.getSession(admin.getEmail(), "Password123!");

        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");

        // Assert
        assertThat(securityContext).isNotNull();

        User principal = (User) securityContext.getAuthentication().getPrincipal();
        assertThat(principal.getEmail()).isEqualTo("admin@test.com");
        assertThat(principal.getRole()).isEqualTo(Role.ADMIN);
        assertThat(principal.getFirstName()).isEqualTo("Admin");
        assertThat(principal.getLastName()).isEqualTo("Test");
        assertThat(principal.getId()).isEqualTo(admin.getId());
    }

    @Test
    void testLoginWithWrongEmailCredentials() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("admin@test.com");
        loginRequest.setPassword("wrongPassword");

        // Act
        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Bad credentials");
    }

    @Test
    void testLoginWithWrongUsernameCredentials() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("WrongUsername");
        loginRequest.setPassword("wrongPassword");

        // Act
        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Bad Credentials");
    }

    @Test
    void testLoginWithNonRegisteredEmail() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("doesnotexist@test.com");
        loginRequest.setPassword("wrongPassword");

        // Act
        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Bad Credentials");
    }

    @Test
    void testGetSessionIsOk() throws Exception {
        // Act
        session = sessionCreationHelper.getSession(client.getEmail(), "Password123!");

        // Act
        String response = mockMvc.perform(get("/api/auth/me")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> sessionResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(sessionResponse).containsEntry("id", client.getId().intValue())
                .containsEntry("email", "client@test.com")
                .containsEntry("role", "CLIENT")
                .containsEntry("firstName", "Client")
                .containsEntry("lastName", "Test");

    }

}
