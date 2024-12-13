package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
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

import java.util.Map;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
public class FreelancerControllerIntegrationTest extends AbstractTestcontainers {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User freelancer;

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
        freelancer = userRepository.save(Helper.createFreelancer(1));
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
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.OPEN, userRepository.save(Helper.createClient())));

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
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.OPEN, userRepository.save(Helper.createClient())));
        Application application = applicationRepository.save(Helper.createApplication(project, freelancer));

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
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.valueOf(status), userRepository.save(Helper.createClient())));

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


}
