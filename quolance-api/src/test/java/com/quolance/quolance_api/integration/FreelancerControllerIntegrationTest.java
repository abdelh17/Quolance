package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.helpers.EntityCreationHelper;
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

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class FreelancerControllerIntegrationTest extends AbstractTestcontainers {
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

    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
        userRepository.deleteAll();
        freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));
        client = userRepository.save(EntityCreationHelper.createClient());
    }

    @BeforeEach
    void setUpSession() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("freelancer1@test.com");
        loginRequest.setPassword("Password123!");

        session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn()
                .getRequest()
                .getSession();
    }

    @Test
    void applyToProjectIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));

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
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));
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
        assertThat(jsonResponse.get("message")).isEqualTo("You have already applied to this project.");
        assertThat(applicationRepository.findAll()).hasSize(1);
        Application createdApplication = applicationRepository.findAll().get(0);
        assertThat(createdApplication.getCreationDate()).isEqualTo(application.getCreationDate());
    }

    @ParameterizedTest
    @ValueSource(strings = {"PENDING", "REJECTED", "CLOSED"})
    void applyToNotOpenProjectDoesNotCreateApplication(String status) throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.valueOf(status), client));

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
        assertThat(jsonResponse.get("message")).isEqualTo("You can't apply to this project.");
        assertThat(applicationRepository.findAll()).isEmpty();
    }

    @Test
    void getApplicationByIdIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));
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
        assertThat(projectResponse.get("id")).isEqualTo(application.getId().intValue());
        assertThat(projectResponse.get("status")).isEqualTo("APPLIED");
        assertThat(projectResponse.get("status")).isEqualTo(application.getApplicationStatus().name());
        assertThat(projectResponse.get("projectId")).isEqualTo(project.getId().intValue());
        assertThat(projectResponse.get("freelancerId")).isEqualTo(freelancer.getId().intValue());
    }

    @Test
    void cancelApplicationIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));
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
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));
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
        assertThat(jsonResponse.get("message")).isEqualTo("You cannot cancel an application that has been accepted");
        assertThat(applicationRepository.findAll()).hasSize(1);
    }

    @Test
    void getAllFreelancerApplicationsIsOk() throws Exception {
        //Arrange
        Project project1 = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));
        Project project2 = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));
        Application application1 = applicationRepository.save(EntityCreationHelper.createApplication(project1, freelancer));
        Application application2 = applicationRepository.save(EntityCreationHelper.createApplication(project2, freelancer));


        //Act
        String response = mockMvc.perform(get("/api/freelancer/applications/all")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<Object> responseList = objectMapper.readValue(response, List.class);

        //Assert
        assertThat(responseList).hasSize(2);

        Map<String, Object> applicationResponse1 = (Map<String, Object>) responseList.get(0);
        Map<String, Object> applicationResponse2 = (Map<String, Object>) responseList.get(1);

        assertThat(applicationResponse1.get("id")).isEqualTo(application1.getId().intValue());
        assertThat(applicationResponse1.get("status")).isEqualTo("APPLIED");
        assertThat(applicationResponse1.get("status")).isEqualTo(application1.getApplicationStatus().name());
        assertThat(applicationResponse1.get("projectId")).isEqualTo(project1.getId().intValue());
        assertThat(applicationResponse1.get("freelancerId")).isEqualTo(freelancer.getId().intValue());

        assertThat(applicationResponse2.get("id")).isEqualTo(application2.getId().intValue());
        assertThat(applicationResponse2.get("status")).isEqualTo("APPLIED");
        assertThat(applicationResponse2.get("status")).isEqualTo(application2.getApplicationStatus().name());
        assertThat(applicationResponse2.get("projectId")).isEqualTo(project2.getId().intValue());
        assertThat(applicationResponse2.get("freelancerId")).isEqualTo(freelancer.getId().intValue());
    }

    @Test
    void getAllProjectsReturnsVisibleProjects() throws Exception {
        //Arrange
        Project project1 = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, LocalDate.now().plusDays(7), client));

        Project project2 = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.CLOSED, LocalDate.now().plusDays(2), client));

        Project project3 = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.PENDING, LocalDate.now().plusDays(7), client));

        Project project4 = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, LocalDate.now().plusDays(7), client));

        Project project5 = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.CLOSED, LocalDate.now().minusDays(7), client));


        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/all")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        List<Object> responseList = objectMapper.readValue(response, List.class);

        //Assert
        assertThat(responseList).hasSize(3);

        Map<String, Object> projectResponse1 = (Map<String, Object>) responseList.get(0);
        Map<String, Object> projectResponse2 = (Map<String, Object>) responseList.get(1);
        Map<String, Object> projectResponse3 = (Map<String, Object>) responseList.get(2);

        assertThat(projectResponse1.get("id")).isEqualTo(project1.getId().intValue());
        assertThat(projectResponse1.get("projectStatus")).isEqualTo("OPEN");
        assertThat(projectResponse1.get("projectStatus")).isEqualTo(project1.getProjectStatus().name());

        assertThat(projectResponse2.get("id")).isEqualTo(project2.getId().intValue());
        assertThat(projectResponse2.get("projectStatus")).isEqualTo("CLOSED");
        assertThat(projectResponse2.get("projectStatus")).isEqualTo(project2.getProjectStatus().name());

        assertThat(projectResponse3.get("id")).isEqualTo(project4.getId().intValue());
        assertThat(projectResponse3.get("projectStatus")).isEqualTo("OPEN");
        assertThat(projectResponse3.get("projectStatus")).isEqualTo(project4.getProjectStatus().name());
    }

    @Test
    void getProjectByIdIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.OPEN, client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse.get("id")).isEqualTo(project.getId().intValue());
        assertThat(projectResponse.get("projectStatus")).isEqualTo("OPEN");
        assertThat(projectResponse.get("projectStatus")).isEqualTo(project.getProjectStatus().name());
    }

    @Test
    void getProjectByIdIsOkWhenClosedAndVisibilityNotExpired() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.CLOSED, LocalDate.now().plusDays(2), client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse.get("id")).isEqualTo(project.getId().intValue());
        assertThat(projectResponse.get("projectStatus")).isEqualTo("CLOSED");
        assertThat(projectResponse.get("projectStatus")).isEqualTo(project.getProjectStatus().name());
    }

    @Test
    void getProjectByIdConflictWhenClosedAndVisibilityExpired() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.CLOSED, LocalDate.now().minusDays(2), client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse.get("message")).isEqualTo("Project visibility has expired.");

    }

    @Test
    void getProjectByIdConflictWhenPending() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProjectWithVisibilityExpirationDate(ProjectStatus.PENDING, client));

        //Act
        String response = mockMvc.perform(get("/api/freelancer/projects/" + project.getId())
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse.get("message")).isEqualTo("Project is not yet approved.");
    }


}
