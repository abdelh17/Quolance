package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.profile.UpdateFreelancerProfileDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
import com.quolance.quolance_api.helpers.SessionCreationHelper;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class FreelancerControllerIntegrationTest extends AbstractTestcontainers {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User freelancer, client;

    private MockHttpSession session;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private SessionCreationHelper sessionCreationHelper;


    @BeforeEach
    void setUp() throws Exception {
        projectRepository.deleteAll();
        userRepository.deleteAll();
        freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));
        client = userRepository.save(EntityCreationHelper.createClient());

        sessionCreationHelper = new SessionCreationHelper(mockMvc, objectMapper);
        session = sessionCreationHelper.getSession("freelancer1@test.com", "Password123!");
    }

    @Test
    void applyToProjectIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        //Act
        mockMvc.perform(post("/api/freelancer/submit-application")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ApplicationCreateDto(project.getId())))
                        .session(session))
                .andExpect(status().isOk());

        //Assert
        Application createdApplication = applicationRepository.findAll().get(0);

        assertThat(createdApplication.getFreelancer().getId()).isEqualTo(freelancer.getId());
        assertThat(createdApplication.getProject().getId()).isEqualTo(project.getId());
        assertThat(createdApplication.getApplicationStatus()).isEqualTo(ApplicationStatus.APPLIED);
    }

    @Test
    void applyToProjectIfAlreadyAppliedDoesNotCreateApplication() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));

        //Act
        String response = mockMvc.perform(post("/api/freelancer/submit-application")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ApplicationCreateDto(project.getId())))
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "You have already applied to this project.");
        assertThat(applicationRepository.findAll()).hasSize(1);
        Application createdApplication = applicationRepository.findAll().getFirst();
        assertThat(createdApplication.getCreationDate()).isEqualToIgnoringNanos(application.getCreationDate());
    }

    @ParameterizedTest
    @ValueSource(strings = {"PENDING", "REJECTED", "CLOSED"})
    void applyToNotOpenProjectDoesNotCreateApplication(String status) throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.valueOf(status), client));

        //Act
        String response = mockMvc.perform(post("/api/freelancer/submit-application")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ApplicationCreateDto(project.getId())))
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "You can't apply to this project.");
        assertThat(applicationRepository.findAll()).isEmpty();
    }

    @Test
    void getApplicationByIdIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/applications/" + application.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);

        assertThat(projectResponse).containsEntry("id", application.getId().intValue())
                .containsEntry("status", "APPLIED")
                .containsEntry("status", application.getApplicationStatus().name())
                .containsEntry("projectId", project.getId().intValue())
                .containsEntry("projectTitle", project.getTitle())
                .containsEntry("freelancerId", freelancer.getId().intValue());
    }

    @Test
    void cancelApplicationIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));

        //Act
        String response = mockMvc.perform(delete("/api/freelancer/applications/" + application.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        assertThat(response).isEqualTo("Application deleted successfully.");
        assertThat(applicationRepository.findAll()).isEmpty();
    }

    @Test
    void cancelAcceptedApplicationDoesNotDelete() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));
        application.setApplicationStatus(ApplicationStatus.ACCEPTED);
        applicationRepository.save(application);

        //Act
        String response = mockMvc.perform(delete("/api/freelancer/applications/" + application.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "You cannot cancel an application that has been accepted");
        assertThat(applicationRepository.findAll()).hasSize(1);
    }

    @Test
    void getAllFreelancerApplicationsIsOk() throws Exception {
        //Arrange
        Project project1 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Project project2 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));
        Application application1 = applicationRepository.save(EntityCreationHelper.createApplication(project1, freelancer));
        Application application2 = applicationRepository.save(EntityCreationHelper.createApplication(project2, freelancer));


        //Act
        String response = mockMvc.perform(get("/api/freelancer/applications/all")
                        .param("sortDirection", "asc")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);

        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");

        //Assert
        assertThat(content).hasSize(2);

        Map<String, Object> applicationResponse1 = content.get(0);
        Map<String, Object> applicationResponse2 = content.get(1);

        assertThat(applicationResponse1)
                .containsEntry("id", application1.getId().intValue())
                .containsEntry("status", "APPLIED")
                .containsEntry("status", application1.getApplicationStatus().name())
                .containsEntry("projectId", project1.getId().intValue())
                .containsEntry("projectTitle", project1.getTitle())
                .containsEntry("freelancerId", freelancer.getId().intValue());

        assertThat(applicationResponse2)
                .containsEntry("id", application2.getId().intValue())
                .containsEntry("status", "APPLIED")
                .containsEntry("status", application2.getApplicationStatus().name())
                .containsEntry("projectId", project2.getId().intValue())
                .containsEntry("projectTitle", project2.getTitle())
                .containsEntry("freelancerId", freelancer.getId().intValue());
    }

    @Test
    void getAllProjectsReturnsVisibleProjects() throws Exception {
        //Arrange
        Project project1 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, LocalDate.now().plusDays(7), client));

        Project project2 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().plusDays(2), client));

        Project project3 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, LocalDate.now().plusDays(7), client));

        Project project4 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, LocalDate.now().plusDays(7), client));

        Project project5 = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().minusDays(7), client));


        //Act
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

        //Assert
        assertThat(content).hasSize(3);

        Map<String, Object> projectResponse1 = content.get(0);
        Map<String, Object> projectResponse2 = content.get(1);
        Map<String, Object> projectResponse3 = content.get(2);

        assertThat(projectResponse1).containsEntry("id", project1.getId().intValue())
                .containsEntry("projectStatus", "OPEN")
                .containsEntry("projectStatus", project1.getProjectStatus().name());

        assertThat(projectResponse2).containsEntry("id", project2.getId().intValue())
                .containsEntry("projectStatus", "CLOSED")
                .containsEntry("projectStatus", project2.getProjectStatus().name());

        assertThat(projectResponse3).containsEntry("id", project4.getId().intValue())
                .containsEntry("projectStatus", "OPEN")
                .containsEntry("projectStatus", project4.getProjectStatus().name());

    }

    @Test
    void getProjectByIdIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse).containsEntry("id", project.getId().intValue())
                .containsEntry("projectStatus", "OPEN")
                .containsEntry("projectStatus", project.getProjectStatus().name());
    }

    @Test
    void getProjectByIdIsOkWhenClosedAndVisibilityNotExpired() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().plusDays(2), client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse)
                .containsEntry("id", project.getId().intValue())
                .containsEntry("projectStatus", "CLOSED")
                .containsEntry("projectStatus", project.getProjectStatus().name());
    }

    @Test
    void getProjectByIdConflictWhenClosedAndVisibilityExpired() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, LocalDate.now().minusDays(2), client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Project visibility has expired.");
    }

    @Test
    void getProjectByIdConflictWhenPending() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Project is not yet approved.");
    }

    @Test
    void updateFreelancerProfileFullUpdateIsOk() throws Exception {
        //Arrange
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
                        Tag.JAVA,
                        Tag.JAVASCRIPT,
                        Tag.PYTHON,
                        Tag.HTML,
                        Tag.CSS
                ))
                .availability(Availability.FULL_TIME)
                .build();

        //Act
        String response = mockMvc.perform(put("/api/freelancer/profile")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        assertThat(response).isEqualTo("Profile updated successfully");

        // Verify the changes in database
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
        //Arrange
        UpdateFreelancerProfileDto updateDto = UpdateFreelancerProfileDto.builder()
                .firstName("John")
                .lastName("Updated")
                .skills(Set.of(Tag.JAVA, Tag.PYTHON))
                .build();

        //Act & Assert
        mockMvc.perform(put("/api/freelancer/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getFreelancerProfileIsOk() throws Exception {
        //Act
        String response = mockMvc.perform(get("/api/public/freelancer/profile/" + freelancer.getUsername())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> profileResponse = objectMapper.readValue(response, LinkedHashMap.class);

        assertThat(profileResponse)
                .containsEntry("firstName", freelancer.getFirstName())
                .containsEntry("lastName", freelancer.getLastName())
                .containsEntry("bio", freelancer.getProfile().getBio());
    }

    @Test
    void getFreelancerProfileUnauthorizedReturnsError() throws Exception {
        //Act & Assert
        mockMvc.perform(get("/api/freelancer/profile"))
                .andExpect(status().isUnauthorized());
    }

}
