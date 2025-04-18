package com.quolance.quolance_api.integration.tests;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileFilterDto;
import com.quolance.quolance_api.dtos.profile.UpdateFreelancerProfileDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.helpers.integration.NoOpNotificationConfig;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.ai_models.recommendation.ProfileEmbeddingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@ContextConfiguration(classes = {NoOpNotificationConfig.class})
class FreelancerControllerIntegrationTest extends BaseIntegrationTest {

    private User freelancer, client;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ProjectRepository projectRepository;
    @MockBean
    private ProfileEmbeddingService profileService;
    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() throws Exception {
        projectRepository.deleteAll();
        userRepository.deleteAll();
        freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));
        client = userRepository.save(EntityCreationHelper.createClient());

        session = sessionCreationHelper.getSession("freelancer1@test.com", "Password123!");
    }

    @Test
    void applyToProjectIsOk() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        String message = "This is a test application message.";
        // Act
        mockMvc.perform(post("/api/freelancer/submit-application")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ApplicationCreateDto(project.getId(), message)))
                        .session(session))
                .andExpect(status().isOk());

        // Assert
        Application createdApplication = applicationRepository.findAll().get(0);
        assertThat(createdApplication.getFreelancer().getId()).isEqualTo(freelancer.getId());
        assertThat(createdApplication.getProject().getId()).isEqualTo(project.getId());
        assertThat(createdApplication.getApplicationStatus()).isEqualTo(ApplicationStatus.APPLIED);
    }

    @Test
    void applyToProjectIfAlreadyAppliedDoesNotCreateApplication() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));
        String message = "This is a test application message.";
        // Act
        String response = mockMvc.perform(post("/api/freelancer/submit-application")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ApplicationCreateDto(project.getId(), message)))
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "You have already applied to this project.");
        assertThat(applicationRepository.findAll()).hasSize(1);
        Application createdApplication = applicationRepository.findAll().get(0);
        assertThat(createdApplication.getCreationDate()).isEqualToIgnoringNanos(application.getCreationDate());
    }

    @ParameterizedTest
    @ValueSource(strings = {"PENDING", "REJECTED", "CLOSED"})
    void applyToNotOpenProjectDoesNotCreateApplication(String status) throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.valueOf(status), client));
        String message = "This is a test application message.";
        // Act
        String response = mockMvc.perform(post("/api/freelancer/submit-application")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ApplicationCreateDto(project.getId(), message)))
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "You can't apply to this project.");
        assertThat(applicationRepository.findAll()).isEmpty();
    }

    @Test
    void getApplicationByIdIsOk() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));
        // Act
        String response = mockMvc.perform(get("/api/freelancer/applications/" + application.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse)
                .containsEntry("id", application.getId().toString())
                .containsEntry("status", application.getApplicationStatus().name())
                .containsEntry("projectId", project.getId().toString())
                .containsEntry("projectTitle", project.getTitle())
                .containsEntry("freelancerId", freelancer.getId().toString());
    }

    @Test
    void cancelApplicationIsOk() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));
        // Act
        String response = mockMvc.perform(delete("/api/freelancer/applications/" + application.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        assertThat(response).isEqualTo("Application deleted successfully.");
        assertThat(applicationRepository.findAll()).isEmpty();
    }

    @Test
    void cancelAcceptedApplicationDoesNotDelete() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));
        application.setApplicationStatus(ApplicationStatus.ACCEPTED);
        applicationRepository.save(application);
        // Act
        String response = mockMvc.perform(delete("/api/freelancer/applications/" + application.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "You cannot cancel an application that has been accepted");
        assertThat(applicationRepository.findAll()).hasSize(1);
    }

    @Test
    void getAllFreelancerApplicationsIsOk() throws Exception {
        // Arrange
        Project project1 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Project project2 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application1 = applicationRepository.save(EntityCreationHelper.createApplication(project1, freelancer));
        Application application2 = applicationRepository.save(EntityCreationHelper.createApplication(project2, freelancer));
        // Act
        String response = mockMvc.perform(get("/api/freelancer/applications/all")
                        .param("sortDirection", "asc")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");
        // Assert
        assertThat(content).hasSize(2);
        Map<String, Object> applicationResponse1 = content.get(0);
        Map<String, Object> applicationResponse2 = content.get(1);
        assertThat(applicationResponse1)
                .containsEntry("id", application1.getId().toString())
                .containsEntry("status", application1.getApplicationStatus().name())
                .containsEntry("projectId", project1.getId().toString())
                .containsEntry("projectTitle", project1.getTitle())
                .containsEntry("freelancerId", freelancer.getId().toString());
        assertThat(applicationResponse2)
                .containsEntry("id", application2.getId().toString())
                .containsEntry("status", application2.getApplicationStatus().name())
                .containsEntry("projectId", project2.getId().toString())
                .containsEntry("projectTitle", project2.getTitle())
                .containsEntry("freelancerId", freelancer.getId().toString());
    }

    @Test
    void getAllProjectsReturnsVisibleProjects() throws Exception {
        // Arrange
        Project project1 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, LocalDate.now().plusDays(7), client));
        Project project2 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().plusDays(2), client));
        Project project3 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, LocalDate.now().plusDays(7), client));
        Project project4 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, LocalDate.now().plusDays(7), client));
        Project project5 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().minusDays(7), client));
        // Act
        String response = mockMvc.perform(get("/api/freelancer/projects/all")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortDirection", "asc")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");
        // Assert
        // Expecting only projects that are visible: OPEN projects and CLOSED projects with non‑expired visibility.
        assertThat(content).hasSize(3);
        Map<String, Object> projectResponse1 = content.get(0);
        Map<String, Object> projectResponse2 = content.get(1);
        Map<String, Object> projectResponse3 = content.get(2);
        assertThat(projectResponse1).containsEntry("id", project1.getId().toString())
                .containsEntry("projectStatus", project1.getProjectStatus().name());
        assertThat(projectResponse2).containsEntry("id", project2.getId().toString())
                .containsEntry("projectStatus", project2.getProjectStatus().name());
        assertThat(projectResponse3).containsEntry("id", project4.getId().toString())
                .containsEntry("projectStatus", project4.getProjectStatus().name());
    }

    @Test
    void getProjectByIdIsOk() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        // Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse).containsEntry("id", project.getId().toString())
                .containsEntry("projectStatus", project.getProjectStatus().name());
    }

    @Test
    void getProjectByIdIsOkWhenClosedAndVisibilityNotExpired() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().plusDays(2), client));
        // Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse)
                .containsEntry("id", project.getId().toString())
                .containsEntry("projectStatus", project.getProjectStatus().name());
    }

    @Test
    void getProjectByIdConflictWhenClosedAndVisibilityExpired() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().minusDays(2), client));
        // Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Project visibility has expired.");
    }

    @Test
    void getProjectByIdConflictWhenPending() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));
        // Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Project is not yet approved.");
    }

    @Test
    void updateFreelancerProfileFullUpdateIsOk() throws Exception {
        // Arrange
        doNothing().when(profileService).updateProfileEmbedding(any(Profile.class));
        UpdateFreelancerProfileDto updateDto = UpdateFreelancerProfileDto.builder()
                .firstName("John")
                .lastName("Updated")
                .bio("Full-stack developer with 5 years of experience")
                .contactEmail("john.updated@test.com")
                .city("San Francisco")
                .state("CA")
                .experienceLevel(FreelancerExperienceLevel.EXPERT)
                .socialMediaLinks(Set.of(
                        "https://linkedin.com/in/johnupdated",
                        "https://github.com/johnupdated"
                ))
                .skills(Set.of(
                        com.quolance.quolance_api.entities.enums.Tag.JAVA,
                        com.quolance.quolance_api.entities.enums.Tag.JAVASCRIPT,
                        com.quolance.quolance_api.entities.enums.Tag.PYTHON,
                        com.quolance.quolance_api.entities.enums.Tag.HTML,
                        com.quolance.quolance_api.entities.enums.Tag.CSS
                ))
                .availability(Availability.FULL_TIME)
                .build();
        // Act
        String response = mockMvc.perform(put("/api/freelancer/profile")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        assertThat(response).isEqualTo("Profile updated successfully");
        User updatedUser = userRepository.findById(freelancer.getId()).get();
        assertThat(updatedUser.getFirstName()).isEqualTo("John");
        assertThat(updatedUser.getLastName()).isEqualTo("Updated");
        assertThat(updatedUser.getProfile().getBio()).isEqualTo("Full-stack developer with 5 years of experience");
        assertThat(updatedUser.getProfile().getContactEmail()).isEqualTo("john.updated@test.com");
        assertThat(updatedUser.getProfile().getCity()).isEqualTo("San Francisco");
        assertThat(updatedUser.getProfile().getState()).isEqualTo("CA");
        assertThat(updatedUser.getProfile().getExperienceLevel()).isEqualTo(FreelancerExperienceLevel.EXPERT);
        assertThat(updatedUser.getProfile().getAvailability()).isEqualTo(Availability.FULL_TIME);
    }

    @Test
    void updateFreelancerProfileUnauthorizedReturnsError() throws Exception {
        // Arrange
        UpdateFreelancerProfileDto updateDto = UpdateFreelancerProfileDto.builder()
                .firstName("John")
                .lastName("Updated")
                .skills(Set.of(com.quolance.quolance_api.entities.enums.Tag.JAVA, com.quolance.quolance_api.entities.enums.Tag.PYTHON))
                .build();
        // Act & Assert
        mockMvc.perform(put("/api/freelancer/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getFreelancerProfileIsOk() throws Exception {
        // Act
        String response = mockMvc.perform(get("/api/public/freelancer/profile/" + freelancer.getUsername())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        // Assert
        Map<String, Object> profileResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(profileResponse)
                .containsEntry("firstName", freelancer.getFirstName())
                .containsEntry("lastName", freelancer.getLastName())
                .containsEntry("bio", freelancer.getProfile().getBio());
    }

    @Test
    void getFreelancerProfileUnauthorizedReturnsError() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/freelancer/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadProfilePictureIsOk() throws Exception {
        // Arrange
        MockMultipartFile photo = new MockMultipartFile(
                "photo",
                "profile.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "Test image content".getBytes()
        );

        // Act
        String response = mockMvc.perform(multipart("/api/freelancer/profile/picture")
                        .file(photo)
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        assertThat(response).isEqualTo("Profile picture uploaded successfully");
    }

    @Test
    void getProfileCompletionIsOk() throws Exception {
        // Act
        String response = mockMvc.perform(get("/api/freelancer/profile/completion")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        int completionPercentage = Integer.parseInt(response);
        assertThat(completionPercentage).isBetween(0, 100);
    }


    @Test
    void getAllFreelancerApplicationsReturnsEmptyList() throws Exception {
        // Act
        String response = mockMvc.perform(get("/api/freelancer/applications/all")
                        .param("page", "0")
                        .param("size", "10")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");
        assertThat(content).isEmpty();
    }

    @Test
    void getProjectByIdWithNonExistentProjectReturnsNotFound() throws Exception {
        // Arrange
        UUID nonExistentProjectId = UUID.randomUUID();

        // Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + nonExistentProjectId)
                        .session(session))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "No Project found with ID: " + nonExistentProjectId);
    }

    @Test
    void updateFreelancerProfileWithMissingFieldsReturnsError() throws Exception {
        // Arrange
        UpdateFreelancerProfileDto updateDto = UpdateFreelancerProfileDto.builder()
                .lastName("Updated") // Missing firstName
                .build();

        // Act
        String response = mockMvc.perform(put("/api/freelancer/profile")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isInternalServerError())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Failed to update profile");
    }

    @Test
    void applyToProjectWithInvalidProjectIdReturnsNotFound() throws Exception {
        // Arrange
        UUID invalidProjectId = UUID.randomUUID();
        String message = "This is a test application message.";

        // Act
        String response = mockMvc.perform(post("/api/freelancer/submit-application")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ApplicationCreateDto(invalidProjectId, message)))
                        .session(session))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "No Project found with ID: " + invalidProjectId);
    }

    @Test
    void deleteApplicationWithNonExistentApplicationReturnsNotFound() throws Exception {
        // Arrange
        UUID nonExistentApplicationId = UUID.randomUUID();

        // Act
        String response = mockMvc.perform(delete("/api/freelancer/applications/" + nonExistentApplicationId)
                        .session(session))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "No Application found with ID: " + nonExistentApplicationId);
    }

    @Test
    void getAllVisibleProjectsWithFiltersIsOk() throws Exception {
        // Arrange
        Project project1 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Project project2 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, client));

        // Act
        String response = mockMvc.perform(get("/api/freelancer/projects/all")
                        .param("page", "0")
                        .param("size", "10")
                        .param("filters.status", "OPEN")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");
        assertThat(content).hasSize(1);
        assertThat(content.get(0)).containsEntry("id", project1.getId().toString());
    }

    @Test
    void uploadProfilePictureWithMissingFileReturnsBadRequest() throws Exception {
        // Act
        String response = mockMvc.perform(multipart("/api/freelancer/profile/picture")
                        .session(session))
                .andExpect(status().isBadRequest())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
         assertThat(jsonResponse).containsEntry("detail", "Required part 'photo' is not present.");
    }

    @Test
    void deleteApplicationUnauthorizedReturnsError() throws Exception {
        // Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));

        // Act & Assert
        mockMvc.perform(delete("/api/freelancer/applications/" + application.getId()))
                .andExpect(status().isUnauthorized());
    }
}
