package com.quolance.quolance_api.integration.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.helpers.integration.NoOpNotificationConfig;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ContextConfiguration(classes = {NoOpNotificationConfig.class})
public class PublicControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getAllVisibleProjectsReturnsOk() throws Exception {
        // Arrange
        User client = userRepository.save(EntityCreationHelper.createClient());
        Project project1 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Project project2 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, client));

        // Act & Assert
        String response = mockMvc.perform(get("/api/public/projects/all"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);

        JsonNode projectsNode = jsonNode.get("content");

        assertThat(projectsNode).hasSize(1);
    }

    @Test
    void getProjectByIdReturnsOk() throws Exception {
        // Arrange
        User client = userRepository.save(EntityCreationHelper.createClient());
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        // Act & Assert
        mockMvc.perform(get("/api/public/projects/" + project.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void getProjectByIdWhenNotExistReturnsNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/public/projects/" + UUID.randomUUID()))
                .andExpect(status().isNotFound());
    }

    @Test
    void getFreelancerProfileReturnsOk() throws Exception {
        // Arrange
        User freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));

        // Act & Assert
        mockMvc.perform(get("/api/public/freelancer/profile/" + freelancer.getUsername()))
                .andExpect(status().isOk());
    }

    @Test
    void getFreelancerProfileWhenNotExistReturnsNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/public/freelancer/profile/NonExistentUser"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllVisibleProjectsWhenNoProjectsExistReturnsEmptyList() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(get("/api/public/projects/all"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode projectsNode = jsonNode.get("content");

        assertThat(projectsNode).isEmpty();
    }

    @Test
    void getProjectByIdWithInvalidIdFormatReturnsBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/public/projects/invalid-uuid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getFreelancerProfileWithInvalidUsernameReturnsNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/public/freelancer/profile/invalid-username"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllVisibleProjectsWithPaginationReturnsPaginatedResults() throws Exception {
        // Arrange
        User client = userRepository.save(EntityCreationHelper.createClient());
        for (int i = 0; i < 15; i++) {
            projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        }

        // Act & Assert
        String response = mockMvc.perform(get("/api/public/projects/all")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode projectsNode = jsonNode.get("content");

        assertThat(projectsNode).hasSize(10);
    }

    @Test
    void getAllVisibleProjectsWithInvalidPaginationParametersReturnsBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/public/projects/all")
                        .param("page", "-1")
                        .param("size", "0"))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    void getFreelancerProfileWhenProfileIsEmptyReturnsOk() throws Exception {
        // Arrange
        User freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));

        // Act & Assert
        mockMvc.perform(get("/api/public/freelancer/profile/" + freelancer.getUsername()))
                .andExpect(status().isOk())
                .andExpect(content().json("{}"));
    }

    @Test
    void unauthorizedAccessToRestrictedEndpointReturnsForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/restricted/projects"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllVisibleProjectsWithNoMatchingFiltersReturnsEmptyList() throws Exception {
        // Arrange
        User client = userRepository.save(EntityCreationHelper.createClient());
        projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, client));

        // Act & Assert
        String response = mockMvc.perform(get("/api/public/projects/all")
                        .param("filters.status", "OPEN"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode projectsNode = jsonNode.get("content");

        assertThat(projectsNode).isEmpty();
    }

    @Test
    void getAllVisibleProjectsWithVisibilityExpirationDateFilterReturnsFilteredProjects() throws Exception {
        // Arrange
        User client = userRepository.save(EntityCreationHelper.createClient());
        projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, LocalDate.now().plusDays(5), client));

        // Act & Assert
        String response = mockMvc.perform(get("/api/public/projects/all")
                        .param("filters.visibilityExpirationDate", LocalDate.now().toString()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode projectsNode = jsonNode.get("content");

        assertThat(projectsNode).hasSize(1);
    }

    @Test
    void getAllVisibleProjectsWithMultipleCriteriaReturnsFilteredProjects() throws Exception {
        // Arrange
        User client = userRepository.save(EntityCreationHelper.createClient());
        projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, LocalDate.now().plusDays(5), client));


        // Act & Assert
        String response = mockMvc.perform(get("/api/public/projects/all")
                        .param("filters.category", "APP_DEVELOPMENT")
                        .param("filters.priceRange", "LESS_500")
                        .param("filters.experienceLevel", "JUNIOR"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode projectsNode = jsonNode.get("content");

        assertThat(projectsNode).hasSize(1);
        assertThat(projectsNode.get(0).get("category").asText()).isEqualTo("APP_DEVELOPMENT");
        assertThat(projectsNode.get(0).get("priceRange").asText()).isEqualTo("LESS_500");
        assertThat(projectsNode.get(0).get("experienceLevel").asText()).isEqualTo("JUNIOR");
    }

}