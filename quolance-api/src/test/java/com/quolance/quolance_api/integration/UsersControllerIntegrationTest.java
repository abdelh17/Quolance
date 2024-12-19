package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.CreateAdminRequestDto;
import com.quolance.quolance_api.dtos.CreateUserRequestDto;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.UpdateUserRequestDto;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class UsersControllerIntegrationTest extends AbstractTestcontainers {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testCreateUserIsOk() throws Exception {
        CreateUserRequestDto request = CreateUserRequestDto.builder()
                .email("test@test.com")
                .firstName("Test")
                .lastName("Test")
                .password("Test1234")
                .passwordConfirmation("Test1234")
                .role("CLIENT")
                .build();

        String response = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        Map<String, Object> userResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(userResponse.get("email")).isEqualTo("test@test.com");
        assertThat(userResponse.get("firstName")).isEqualTo("Test");
        assertThat(userResponse.get(("lastName"))).isEqualTo("Test");
        assertThat(userResponse.get("role")).isEqualTo("CLIENT");

        assertThat(userRepository.findAll().size()).isEqualTo(1);
        User savedUser = userRepository.findByEmail("test@test.com").get();
        assertThat(savedUser.getFirstName()).isEqualTo("Test");
        assertThat(savedUser.getLastName()).isEqualTo("Test");
        assertThat(savedUser.getEmail()).isEqualTo("test@test.com");
        assertThat(savedUser.getRole()).isEqualTo(Role.CLIENT);
    }

    @Test
    void testCreateUserDoesNotCreateIfExistsByEmail() throws Exception {
        // Arrange
        userRepository.save(EntityCreationHelper.createClient());
        CreateUserRequestDto request = CreateUserRequestDto.builder()
                .email("client@test.com")
                .firstName("Test")
                .lastName("Test")
                .password("Test1234")
                .passwordConfirmation("Test1234")
                .role("CLIENT")
                .build();

        // Act
        String response = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andReturn()
                .getResponse().getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(userRepository.findAll().size()).isEqualTo(1);
        assertThat(jsonResponse.get("message")).isEqualTo("A user with this email already exists.");
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void testCreateAdminIsOk() throws Exception {
        CreateAdminRequestDto request = CreateAdminRequestDto.builder()
                .email("test@test.com")
                .firstName("Test")
                .lastName("Test")
                .temporaryPassword("Test1234")
                .passwordConfirmation("Test1234")
                .build();

        mockMvc.perform(post("/api/users/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        assertThat(userRepository.findAll().size()).isEqualTo(1);
        User savedUser = userRepository.findByEmail("test@test.com").get();
        assertThat(savedUser.getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    @WithMockUser(roles = {"CLIENT"})
    void testCreateAdminDoesNotCreateIfNotByAdmin() throws Exception {
        // Arrange
        CreateAdminRequestDto request = CreateAdminRequestDto.builder()
                .email("test@test.com")
                .firstName("Test")
                .lastName("Test")
                .temporaryPassword("Test1234")
                .passwordConfirmation("Test1234")
                .build();
        // Act
        mockMvc.perform(post("/api/users/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andReturn()
                .getResponse().getContentAsString();

        // Assert
        assertThat(userRepository.findAll().size()).isEqualTo(0);
    }

    @Test
    void testUpdateUserIsOk() throws Exception {
        // Arrange
        User user = userRepository.save(EntityCreationHelper.createClient());
        UpdateUserRequestDto request = UpdateUserRequestDto.builder()
                .firstName("NEW")
                .lastName("NEW")
                .build();
        MockHttpSession session = getSession();

        // Act
        String response = mockMvc.perform(put("/api/users").session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        // Assert
        Map<String, Object> userResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(userResponse.get("firstName")).isEqualTo("NEW");
        assertThat(userResponse.get("lastName")).isEqualTo("NEW");
        User updatedUser = userRepository.findByEmail("client@test.com").get();
        assertThat(updatedUser.getFirstName()).isEqualTo("NEW");
        assertThat(updatedUser.getLastName()).isEqualTo("NEW");

    }

    private MockHttpSession getSession() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("client@test.com");
        loginRequest.setPassword("Password123!");

        MockHttpSession session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getRequest()
                .getSession();
        return session;
    }
}
