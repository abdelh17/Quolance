package com.quolance.quolance_api.integration.tests;

import com.quolance.quolance_api.dtos.users.LoginRequestDto;
import com.quolance.quolance_api.dtos.users.VerifyEmailDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
class AuthControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    private User client, freelancer, admin;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        client = userRepository.save(EntityCreationHelper.createClient());
        freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));
        admin = userRepository.save(EntityCreationHelper.createAdmin());
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
        assertThat(sessionResponse).containsEntry("id", client.getId().toString())
                .containsEntry("email", "client@test.com")
                .containsEntry("role", "CLIENT")
                .containsEntry("firstName", "Client")
                .containsEntry("lastName", "Test");

    }


    @Test
    void testCsrfEndpointIsOk() throws Exception {
        // Act
        mockMvc.perform(get("/api/auth/csrf"))
                .andExpect(status().isOk());
    }

    @Test
    void testLoginClientSessionAttributes() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("client@test.com");
        loginRequest.setPassword("Password123!");

        // Act
        session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn()
                .getRequest()
                .getSession();

        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");

        // Assert
        User principal = (User) securityContext.getAuthentication().getPrincipal();
        assertThat(principal.getEmail()).isEqualTo("client@test.com");
        assertThat(principal.getRole()).isEqualTo(Role.CLIENT);
    }

    @Test
    void testGetSessionAttributes() throws Exception {
        // Act
        session = sessionCreationHelper.getSession(client.getEmail(), "Password123!");

        // Act
        String response = mockMvc.perform(get("/api/auth/me")
                        .session(session))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> sessionResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(sessionResponse).containsEntry("id", client.getId().toString())
                .containsEntry("email", "client@test.com")
                .containsEntry("role", "CLIENT");
    }

    @Test
    void testLogoutFreelancerSessionAttributes() throws Exception {
        // Arrange
        session = sessionCreationHelper.getSession(freelancer.getEmail(), "Password123!");

        // Assert before logout
        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
        assertThat(securityContext).isNotNull();

        // Act
        mockMvc.perform(post("/api/auth/logout")
                        .session(session))
                .andReturn();

        // Assert after logout
        assertThat(session.isInvalid()).isTrue();
    }

    @Test
    void testLogoutAdminSessionAttributes() throws Exception {
        // Arrange
        session = sessionCreationHelper.getSession(admin.getEmail(), "Password123!");

        // Assert before logout
        SecurityContext securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
        assertThat(securityContext).isNotNull();

        // Act
        mockMvc.perform(post("/api/auth/logout")
                        .session(session))
                .andReturn();

        // Assert after logout
        assertThat(session.isInvalid()).isTrue();
    }

    @Test
    void testResendVerificationEmailAttributesForFreelancer() throws Exception {
        // Act
        String response = mockMvc.perform(post("/api/auth/resend-verification/" + freelancer.getEmail()))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        if (freelancer.isVerified()) {
            assertThat(response).contains("Email already verified");
        } else {
            assertThat(response).contains("Code sent successfully");
        }
    }

    @Test
    void testVerifyEmailAttributesForFreelancer() throws Exception {
        // Arrange
        VerifyEmailDto verifyEmailDto = new VerifyEmailDto();
        verifyEmailDto.setVerificationCode("123456");

        // Act
        String response = mockMvc.perform(post("/api/auth/verify-email/" + freelancer.getEmail())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyEmailDto)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        if (freelancer.isVerified()) {
            assertThat(response).contains("Email already verified");
        } else {
            assertThat(response).contains("Email verified successfully");
        }
    }

    @Test
    void testVerifyEmailAttributesForAdmin() throws Exception {
        // Arrange
        VerifyEmailDto verifyEmailDto = new VerifyEmailDto();
        verifyEmailDto.setVerificationCode("123456");

        // Act
        String response = mockMvc.perform(post("/api/auth/verify-email/" + admin.getEmail())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyEmailDto)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        if (admin.isVerified()) {
            assertThat(response).contains("Email already verified");
        } else {
            assertThat(response).contains("Email verified successfully");
        }
    }

    @Test
    void testResendVerificationEmailAttributesForAdmin() throws Exception {
        // Act
        String response = mockMvc.perform(post("/api/auth/resend-verification/" + admin.getEmail()))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        if (admin.isVerified()) {
            assertThat(response).contains("Email already verified");
        } else {
            assertThat(response).contains("Code sent successfully");
        }
    }

    @Test
    void testLoginWithInvalidEmailFormat() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("invalid-email-format");
        loginRequest.setPassword("Password123!");

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
    void testLoginWithEmptyPassword() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("client@test.com");
        loginRequest.setPassword("");

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
    void testGetSessionWithInvalidSession() throws Exception {
        // Act
        String response = mockMvc.perform(get("/api/auth/me")
                        .session(new MockHttpSession()))
                .andExpect(status().isUnauthorized())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Authentication required");
    }

    @Test
    void testLogoutWithoutSession() throws Exception {
        // Act
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testVerifyEmailWithInvalidCode() throws Exception {
        // Arrange
        VerifyEmailDto verifyEmailDto = new VerifyEmailDto();
        verifyEmailDto.setVerificationCode("invalid-code");

        // Act
        String response = mockMvc.perform(post("/api/auth/verify-email/" + client.getEmail())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyEmailDto)))
                .andExpect(status().isBadRequest())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        assertThat(response).contains("Email already verified");
    }

    @Test
    void testResendVerificationEmailWithNonExistentEmail() throws Exception {
        // Act
        String response = mockMvc.perform(post("/api/auth/resend-verification/nonexistent@test.com"))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        assertThat(response).contains("Invalid credentials");
    }

    @Test
    void testLoginWithInvalidPassword() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("client@test.com");
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
    void testLoginWithEmptyUsername() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("");
        loginRequest.setPassword("Password123!");

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
    void testLoginWithNonExistentUsername() throws Exception {
        // Arrange
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setUsername("nonexistentuser");
        loginRequest.setPassword("Password123!");

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


}
