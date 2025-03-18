package com.quolance.quolance_api.integration.tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.users.CreateAdminRequestDto;
import com.quolance.quolance_api.dtos.users.CreateUserRequestDto;
import com.quolance.quolance_api.dtos.users.UpdateUserPasswordRequestDto;
import com.quolance.quolance_api.dtos.users.UpdateUserRequestDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.helpers.integration.NoOpNotificationConfig;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@ContextConfiguration(classes = {NoOpNotificationConfig.class})
class UsersControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        userRepository.save(EntityCreationHelper.createAdmin());
    }

    @Test
    void testCreateUserIsOk() throws Exception {
        CreateUserRequestDto request = CreateUserRequestDto.builder()
                .email("test@test.com")
                .username("MyClient123")
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

        assertThat(userResponse)
                .containsEntry("email", "test@test.com")
                .containsEntry("username", "MyClient123")
                .containsEntry("firstName", "Test")
                .containsEntry("lastName", "Test")
                .containsEntry("role", "CLIENT");

        assertThat(userRepository.findAll()).hasSize(2);
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
                .username("MyClient123")
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
        assertThat(userRepository.findAll()).hasSize(2);
        assertThat(jsonResponse).containsEntry("message", "A user with this email already exists.");
    }

    @Test
    void testCreateAdminIsOk() throws Exception {
        CreateAdminRequestDto request = CreateAdminRequestDto.builder()
                .email("test@test.com")
                .username("TestTest")
                .firstName("Test")
                .lastName("Test")
                .temporaryPassword("Test1234")
                .passwordConfirmation("Test1234")
                .build();
        session = sessionCreationHelper.getSession("admin@test.com", "Password123!");

        mockMvc.perform(post("/api/users/admin").session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        assertThat(userRepository.findAll()).hasSize(2);
        User savedUser = userRepository.findByEmail("test@test.com").get();
        assertThat(savedUser.getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    @WithMockUser(roles = {"CLIENT"})
    void testCreateAdminDoesNotCreateIfNotByAdmin() throws Exception {
        // Arrange
        CreateAdminRequestDto request = CreateAdminRequestDto.builder()
                .email("test@test.com")
                .username("MyClient123")
                .firstName("Test")
                .lastName("Test")
                .temporaryPassword("Test1234")
                .passwordConfirmation("Test1234")
                .build();
        // Act
        mockMvc.perform(post("/api/users/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());

        // Assert
        assertThat(userRepository.findAll()).hasSize(1);
        assertThat(userRepository.findByEmail("test@test.com")).isEmpty();
    }

    @Test
    void testUpdateUserInfoUserIsOk() throws Exception {
        // Arrange
        userRepository.save(EntityCreationHelper.createClient());
        UpdateUserRequestDto request = UpdateUserRequestDto.builder()
                .firstName("NEW")
                .lastName("NEW")
                .build();
        session = sessionCreationHelper.getSession("client@test.com", "Password123!");

        // Act
        String response = mockMvc.perform(put("/api/users").session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        // Assert
        Map<String, Object> userResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(userResponse)
                .containsEntry("firstName", "NEW")
                .containsEntry("lastName", "NEW");

        User updatedUser = userRepository.findByEmail("client@test.com").get();
        assertThat(updatedUser.getFirstName()).isEqualTo("NEW");
        assertThat(updatedUser.getLastName()).isEqualTo("NEW");
    }

    @Test
    void testUpdateUserInfoPasswordIsOk() throws Exception {
        // Arrange
        User createdClient = userRepository.save(EntityCreationHelper.createClient());
        UpdateUserPasswordRequestDto request = UpdateUserPasswordRequestDto.builder()
                .oldPassword("Password123!")
                .password("NewPassword123!")
                .confirmPassword("NewPassword123!")
                .build();

        session = sessionCreationHelper.getSession("client@test.com", "Password123!");

        // Act
        mockMvc.perform(patch("/api/users/password").session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Assert
        User updatedUser = userRepository.findByEmail("client@test.com").get();
        assertThat(updatedUser.getPassword()).isNotEqualTo(createdClient.getPassword());
    }

    @Test
    void testUpdateUserInfoPasswordErrorIfWrongPasswordFormat() throws Exception {
        // Arrange
        User createdClient = userRepository.save(EntityCreationHelper.createClient());
        UpdateUserPasswordRequestDto request = UpdateUserPasswordRequestDto.builder()
                .oldPassword("Password123!")
                .password("test!")
                .confirmPassword("test!")
                .build();

        session = sessionCreationHelper.getSession("client@test.com", "Password123!");

        // Act
        mockMvc.perform(patch("/api/users/password").session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnprocessableEntity());

        // Assert
        User updatedUser = userRepository.findByEmail("client@test.com").get();
        assertThat(updatedUser.getPassword()).isEqualTo(createdClient.getPassword());
    }
}
