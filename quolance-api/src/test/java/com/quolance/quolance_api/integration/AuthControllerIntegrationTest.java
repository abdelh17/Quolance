package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.repositories.ProjectRepository;
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

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class AuthControllerIntegrationTest extends AbstractTestcontainers {
    private MockHttpSession session;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;


    private User client, freelancer, admin;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        userRepository.deleteAll();
        client = userRepository.save(EntityCreationHelper.createClient());
        freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));
        admin = userRepository.save(EntityCreationHelper.createAdmin());
    }

    @Test
    public void testLoginClientIsOk() throws Exception {
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
    public void testLoginFreelancerIsOk() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("freelancer1@test.com");
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
        assertThat(principal.getEmail()).isEqualTo("freelancer1@test.com");
        assertThat(principal.getRole()).isEqualTo(Role.FREELANCER);
        assertThat(principal.getFirstName()).isEqualTo("Freelancer1");
        assertThat(principal.getLastName()).isEqualTo("Test");
        assertThat(principal.getId()).isEqualTo(freelancer.getId());
    }

    @Test
    public void testLoginAdminIsOk() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("admin@test.com");
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
        assertThat(principal.getEmail()).isEqualTo("admin@test.com");
        assertThat(principal.getRole()).isEqualTo(Role.ADMIN);
        assertThat(principal.getFirstName()).isEqualTo("Admin");
        assertThat(principal.getLastName()).isEqualTo("Test");
        assertThat(principal.getId()).isEqualTo(admin.getId());
    }

    @Test
    void testLoginWithWrongCredentials() throws Exception {
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
        assertThat(jsonResponse.get("message")).isEqualTo("Bad credentials");
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
        assertThat(jsonResponse.get("message")).isEqualTo("Bad Credentials");
    }

    @Test
    void testGetSessionIsOk() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("client@test.com");
        loginRequest.setPassword("Password123!");

        // Act
        MockHttpSession session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn()
                .getRequest()
                .getSession();

        // Act
        String response = mockMvc.perform(get("/api/auth/me")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> sessionResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(sessionResponse.get("id")).isEqualTo(client.getId().intValue());
        assertThat(sessionResponse.get("email")).isEqualTo("client@test.com");
        assertThat(sessionResponse.get("role")).isEqualTo("CLIENT");
        assertThat(sessionResponse.get("firstName")).isEqualTo("Client");
        assertThat(sessionResponse.get("lastName")).isEqualTo("Test");

    }


}
