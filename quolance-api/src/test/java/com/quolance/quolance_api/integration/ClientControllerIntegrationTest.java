package com.quolance.quolance_api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
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

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ClientControllerIntegrationTest extends AbstractTestcontainers {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User client;

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
        client = userRepository.save(Helper.createClient());
    }

    @BeforeEach
    void setUpSession() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("client@test.com");
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
    void createProjectValidIsOk() throws Exception {
        //Arrange
        ProjectCreateDto projectDto = ProjectCreateDto.builder()
                .title("title")
                .description("description")
                .category(ProjectCategory.APP_DEVELOPMENT)
                .priceRange(PriceRange.LESS_500)
                .experienceLevel(FreelancerExperienceLevel.JUNIOR)
                .expectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE)
                .build();

        //Act
        String response = mockMvc.perform(post("/api/client/create-project").session(session).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(projectDto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        assertThat(response).isEqualTo("Project created successfully");
    }

    @Test
    void createProjectWithExpirationDateSetsExpirationDate() throws Exception {
        //Arrange
        ProjectCreateDto projectDto = ProjectCreateDto.builder()
                .title("title")
                .description("description")
                .category(ProjectCategory.APP_DEVELOPMENT)
                .priceRange(PriceRange.LESS_500)
                .experienceLevel(FreelancerExperienceLevel.JUNIOR)
                .expectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE)
                .expirationDate(LocalDate.now().plusDays(10))
                .build();
        //Act
        mockMvc.perform(post("/api/client/create-project").session(session).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(projectDto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Project created successfully"));
        //Assert
        Project project = projectRepository.findAll().getFirst();
        assertThat(project.getExpirationDate()).isEqualTo(LocalDate.now().plusDays(10));
    }


    @Test
    void createProjectWithNoExpirationDateSetsExpirationDateTo7DaysFromNow() throws Exception {
        //Arrange
        ProjectCreateDto projectDto = ProjectCreateDto.builder()
                .title("title")
                .description("description")
                .category(ProjectCategory.APP_DEVELOPMENT)
                .priceRange(PriceRange.LESS_500)
                .experienceLevel(FreelancerExperienceLevel.JUNIOR)
                .expectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE)
                .build();

        //Act
        String response = mockMvc.perform(post("/api/client/create-project").session(session).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(projectDto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        Project project = projectRepository.findAll().getFirst();
        assertThat(response).isEqualTo("Project created successfully");
        assertThat(project.getExpirationDate()).isEqualTo(LocalDate.now().plusDays(7));
    }

    @Test
    void getProjectByIdWhenNoneExistReturnsNotFound() throws Exception {
        //Act
        String response = mockMvc.perform(get("/api/client/projects/1").session(session))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);

        //Assert
        assertThat(jsonResponse.get("message")).isEqualTo("No Project found with ID: 1");
    }

    @Test
    void updatePendingProjectReturnsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.PENDING, client));

        ProjectUpdateDto updateProjectDto = ProjectUpdateDto.builder()
                .title("updated title")
                .description("new description")
                .category(ProjectCategory.CONTENT_WRITING)
                .priceRange(PriceRange.MORE_10000)
                .experienceLevel(FreelancerExperienceLevel.EXPERT)
                .expectedDeliveryTime(ExpectedDeliveryTime.IMMEDIATELY)
                .build();

        //Act
        String response = mockMvc.perform(put("/api/client/projects/" + project.getId()).session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateProjectDto)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse.get("title")).isEqualTo("updated title");
        assertThat(projectResponse.get("description")).isEqualTo("new description");
        assertThat(projectResponse.get("category")).isEqualTo("CONTENT_WRITING");
        assertThat(projectResponse.get("priceRange")).isEqualTo("MORE_10000");
        assertThat(projectResponse.get("experienceLevel")).isEqualTo("EXPERT");
        assertThat(projectResponse.get("expectedDeliveryTime")).isEqualTo("IMMEDIATELY");
    }

//    @Test
//    void updateProjectWithEmptyFieldsDoesNotUpdateProject() throws Exception {
//        //Arrange
//        Project project = Helper.createProject(ProjectStatus.PENDING);
//
//        ProjectUpdateDto updateProjectDto = ProjectUpdateDto.builder()
//                .title("")
//                .description("")
//                .category(null)
//                .priceRange(null)
//                .experienceLevel(null)
//                .expectedDeliveryTime(null)
//                .build();
//
//        //Act
//        String response = mockMvc.perform(put("/api/client/projects/" + project.getId()).session(session)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(updateProjectDto)))
//                .andExpect(status().isOk())
//                .andReturn()
//                .getResponse()
//                .getContentAsString();
//
//        //Assert
//        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
//        assertThat(projectResponse.get("title")).isEqualTo("title");
//        assertThat(projectResponse.get("description")).isEqualTo("description");
//        assertThat(projectResponse.get("category")).isEqualTo("APP_DEVELOPMENT");
//        assertThat(projectResponse.get("priceRange")).isEqualTo("LESS_500");
//        assertThat(projectResponse.get("experienceLevel")).isEqualTo("JUNIOR");
//        assertThat(projectResponse.get("expectedDeliveryTime")).isEqualTo("FLEXIBLE");
//    }

    @ParameterizedTest
    @ValueSource(strings = {"OPEN", "CLOSED", "REJECTED"})
    void updateNotPendingProjectDoesNotUpdateProject(String status) throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.valueOf(status), client));

        ProjectUpdateDto updateProjectDto = ProjectUpdateDto.builder()
                .title("updated title")
                .description("new description")
                .category(ProjectCategory.CONTENT_WRITING)
                .priceRange(PriceRange.MORE_10000)
                .experienceLevel(FreelancerExperienceLevel.EXPERT)
                .expectedDeliveryTime(ExpectedDeliveryTime.IMMEDIATELY)
                .build();

        //Act
        String response = mockMvc.perform(put("/api/client/projects/" + project.getId()).session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateProjectDto)))
                .andExpect(status().isForbidden())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse.get("message")).isEqualTo("Project can only be updated when in PENDING state");
        assertThat(project == projectRepository.findById(project.getId()).get());
    }

    @Test
    void getProjectByIdReturnsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.PENDING, client));

        //Act
        String response = mockMvc.perform(get("/api/client/projects/" + project.getId()).session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse.get("title")).isEqualTo("title");
        assertThat(projectResponse.get("description")).isEqualTo("description");
        assertThat(projectResponse.get("category")).isEqualTo("APP_DEVELOPMENT");
        assertThat(projectResponse.get("priceRange")).isEqualTo("LESS_500");
        assertThat(projectResponse.get("experienceLevel")).isEqualTo("JUNIOR");
        assertThat(projectResponse.get("expectedDeliveryTime")).isEqualTo("FLEXIBLE");
    }

    @Test
    void getAllProjectsWhenNoneExistReturnsEmptyList() throws Exception {
        //Act
        String response = mockMvc.perform(get("/api/client/projects/all").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        List<Object> responseList = objectMapper.readValue(response, List.class);
        assertThat(responseList.size()).isEqualTo(0);
    }

    @Test
    void getAllProjectsWhenExistIsOk() throws Exception {
        //Arrange
        projectRepository.save(Helper.createProject(ProjectStatus.PENDING, client));

        Project project2 = new Project();
        project2.setTitle("title2");
        project2.setDescription("description2");
        project2.setCategory(ProjectCategory.APP_DEVELOPMENT);
        project2.setPriceRange(PriceRange.LESS_500);
        project2.setExperienceLevel(FreelancerExperienceLevel.JUNIOR);
        project2.setExpectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE);
        project2.setClient(client);
        projectRepository.save(project2);

        //Act
        String response = mockMvc.perform(get("/api/client/projects/all").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        List<Object> responseList = objectMapper.readValue(response, List.class);

        //Assert
        assertThat(responseList.size()).isEqualTo(2);

        Map<String, Object> projectResponse1 = (Map<String, Object>) responseList.get(0);
        Map<String, Object> projectResponse2 = (Map<String, Object>) responseList.get(1);

        assertThat(projectResponse1.get("title")).isEqualTo("title");
        assertThat(projectResponse1.get("description")).isEqualTo("description");
        assertThat(projectResponse1.get("category")).isEqualTo("APP_DEVELOPMENT");
        assertThat(projectResponse1.get("priceRange")).isEqualTo("LESS_500");
        assertThat(projectResponse1.get("experienceLevel")).isEqualTo("JUNIOR");
        assertThat(projectResponse1.get("expectedDeliveryTime")).isEqualTo("FLEXIBLE");

        assertThat(projectResponse2.get("title")).isEqualTo("title2");
        assertThat(projectResponse2.get("description")).isEqualTo("description2");
        assertThat(projectResponse2.get("category")).isEqualTo("APP_DEVELOPMENT");
        assertThat(projectResponse2.get("priceRange")).isEqualTo("LESS_500");
        assertThat(projectResponse2.get("experienceLevel")).isEqualTo("JUNIOR");
        assertThat(projectResponse2.get("expectedDeliveryTime")).isEqualTo("FLEXIBLE");

    }


    @Test
    void deleteProjectIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.PENDING, client));

        //Act
        String response = mockMvc.perform(delete("/api/client/projects/" + project.getId()).session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        assertThat(response).isEqualTo("Project deleted successfully");
        assertThat(projectRepository.findById(project.getId())).isEmpty();
    }

    @Test
    void deleteNonExistingProjectGivesError() throws Exception {
        //Act
        String response = mockMvc.perform(delete("/api/client/projects/1").session(session))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse.get("message")).isEqualTo("No Project found with ID: 1");
    }

    @Test
    void getAllApplicationsToProjectGivesOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.PENDING, client));

        User freelancer = userRepository.save(Helper.createFreelancer(1));

        applicationRepository.save(Helper.createApplication(project, freelancer));

        //Act
        String response = mockMvc.perform(get("/api/client/projects/" + project.getId() + "/applications/all").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        List<Object> responseList = objectMapper.readValue(response, List.class);
        Map<String, Object> applicationReturned = (Map<String, Object>) responseList.get(0);

        //Assert
        assertThat(applicationReturned.get("projectId")).isEqualTo(project.getId().intValue());
        assertThat(applicationReturned.get("freelancerId")).isEqualTo(freelancer.getId().intValue());
    }

    @Test
    void getAllApplicationsToProjectWhenNoneExistReturnsEmptyList() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.PENDING, client));

        //Act
        String response = mockMvc.perform(get("/api/client/projects/" + project.getId() + "/applications/all").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        List<Object> responseList = objectMapper.readValue(response, List.class);

        //Assert
        assertThat(responseList.size()).isEqualTo(0);
    }


    @Test
    void selectFreelancerChangesApplicationStatusAndProjectStatusIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.OPEN, client));

        User freelancer = userRepository.save(Helper.createFreelancer(1));

        Application application = applicationRepository.save(Helper.createApplication(project, freelancer));

        //Act
        String response = mockMvc.perform(post("/api/client/applications/" + application.getId() + "/select-freelancer").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        assertThat(response).isEqualTo("Freelancer selected successfully");
        assertThat(applicationRepository.findById(application.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.ACCEPTED);
        assertThat(projectRepository.findById(project.getId()).get().getSelectedFreelancer().getEmail()).isEqualTo(freelancer.getEmail());
        assertThat(projectRepository.findById(project.getId()).get().getProjectStatus()).isEqualTo(ProjectStatus.CLOSED);
    }

    @Test
    void selectFreelancerRejectsOtherFreelancersApplications() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.OPEN, client));

        User freelancer1 = userRepository.save(Helper.createFreelancer(1));

        User freelancer2 = userRepository.save(Helper.createFreelancer(2));

        Application application1 = applicationRepository.save(Helper.createApplication(project, freelancer1));

        Application application2 = applicationRepository.save(Helper.createApplication(project, freelancer2));

        //Act
        mockMvc.perform(post("/api/client/applications/" + application1.getId() + "/select-freelancer").session(session))
                .andExpect(status().isOk());

        assertThat(applicationRepository.findById(application2.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
    }


    @Test
    void rejectApplicationIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.OPEN, client));

        User freelancer = userRepository.save(Helper.createFreelancer(1));

        Application application = applicationRepository.save(Helper.createApplication(project, freelancer));

        //Act
        String response = mockMvc.perform(post("/api/client/applications/" + application.getId() + "/reject-freelancer").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        assertThat(response).isEqualTo("Freelancer rejected successfully");
        assertThat(applicationRepository.findById(application.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
    }

    @Test
    void rejectManyApplicationsIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(Helper.createProject(ProjectStatus.OPEN, client));

        User freelancer1 = userRepository.save(Helper.createFreelancer(1));

        User freelancer2 = userRepository.save(Helper.createFreelancer(2));

        Application application1 = applicationRepository.save(Helper.createApplication(project, freelancer1));

        Application application2 = applicationRepository.save(Helper.createApplication(project, freelancer2));

        //Act
        String response = mockMvc.perform(post("/api/client/applications/bulk/reject-freelancer")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(application1.getId(), application2.getId()))))
                .andExpect(status().isPartialContent())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
//        assertThat(response).isEqualTo("All selected freelancers rejected successfully");
        assertThat(applicationRepository.findById(application1.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
        assertThat(applicationRepository.findById(application2.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
    }


}