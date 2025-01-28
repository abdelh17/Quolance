package com.quolance.quolance_api.integration.tests;

import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


class ClientControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User client;

    @BeforeEach
    void setUp() throws Exception {
        projectRepository.deleteAll();
        userRepository.deleteAll();
        client = userRepository.save(EntityCreationHelper.createClient());

        session = sessionCreationHelper.getSession("client@test.com", "Password123!");
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
        Project project = projectRepository.findAll().getFirst();
        assertThat(response).isEqualTo("Project created successfully");
        assertThat(projectRepository.findAll()).hasSize(1);
        assertThat(project.getTitle()).isEqualTo("title");
        assertThat(project.getDescription()).isEqualTo("description");
        assertThat(project.getCategory()).isEqualTo(ProjectCategory.APP_DEVELOPMENT);
        assertThat(project.getPriceRange()).isEqualTo(PriceRange.LESS_500);
        assertThat(project.getExperienceLevel()).isEqualTo(FreelancerExperienceLevel.JUNIOR);
        assertThat(project.getExpectedDeliveryTime()).isEqualTo(ExpectedDeliveryTime.FLEXIBLE);
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
        mockMvc.perform(post("/api/client/create-project").session(session)
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(projectDto)))
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
        assertThat(jsonResponse).containsEntry("message", "No Project found with ID: 1");
    }

    @Test
    void updatePendingProjectReturnsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

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
        assertThat(projectResponse).containsEntry("title", "updated title")
                .containsEntry("description", "new description")
                .containsEntry("category", "CONTENT_WRITING")
                .containsEntry("priceRange", "MORE_10000")
                .containsEntry("experienceLevel", "EXPERT")
                .containsEntry("expectedDeliveryTime", "IMMEDIATELY");
    }

    @ParameterizedTest
    @ValueSource(strings = {"OPEN", "CLOSED", "REJECTED"})
    void updateNotPendingProjectDoesNotUpdateProject(String status) throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.valueOf(status), client));

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
        assertThat(jsonResponse).containsEntry("message", "Project can only be updated when in PENDING state");
    }

    @Test
    void getProjectByIdReturnsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

        //Act
        String response = mockMvc.perform(get("/api/client/projects/" + project.getId()).session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        Map<String, Object> projectResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(projectResponse).containsEntry("title", "title")
                .containsEntry("description", "description")
                .containsEntry("category", "APP_DEVELOPMENT")
                .containsEntry("priceRange", "LESS_500")
                .containsEntry("experienceLevel", "JUNIOR")
                .containsEntry("expectedDeliveryTime", "FLEXIBLE");
    }

    @Test
    void getAllProjectsWhenNoneExistReturnsEmptyList() throws Exception {
        //Act
        String response = mockMvc.perform(get("/api/client/projects/all").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        //Assert
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);

        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");
        assertThat(content).isEmpty();
    }

    @Test
    void getAllProjectsWhenExistIsOk() throws Exception {
        //Arrange
        projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

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
        String response = mockMvc.perform(get("/api/client/projects/all")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortDirection", "asc")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);

        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");

        //Assert
        assertThat(content).hasSize(2);

        Map<String, Object> projectResponse1 = content.get(0);
        Map<String, Object> projectResponse2 = content.get(1);

        assertThat(projectResponse1).containsEntry("title", "title")
                .containsEntry("description", "description")
                .containsEntry("category", "APP_DEVELOPMENT")
                .containsEntry("priceRange", "LESS_500")
                .containsEntry("experienceLevel", "JUNIOR")
                .containsEntry("expectedDeliveryTime", "FLEXIBLE");

        assertThat(projectResponse2).containsEntry("title", "title2")
                .containsEntry("description", "description2")
                .containsEntry("category", "APP_DEVELOPMENT")
                .containsEntry("priceRange", "LESS_500")
                .containsEntry("experienceLevel", "JUNIOR")
                .containsEntry("expectedDeliveryTime", "FLEXIBLE");
    }


    @Test
    void deleteProjectIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

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
        assertThat(jsonResponse).containsEntry("message", "No Project found with ID: 1");
    }

    @Test
    void getAllApplicationsToProjectGivesOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

        User freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));

        applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));

        //Act
        String response = mockMvc.perform(get("/api/client/projects/" + project.getId() + "/applications/all").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        List<Object> responseList = objectMapper.readValue(response, List.class);
        Map<String, Object> applicationReturned = (Map<String, Object>) responseList.get(0);

        //Assert
        assertThat(applicationReturned)
                .containsEntry("projectId", project.getId().intValue())
                .containsEntry("projectTitle", project.getTitle())
                .containsEntry("freelancerId", freelancer.getId().intValue());

    }

    @Test
    void getAllApplicationsToProjectWhenNoneExistReturnsEmptyList() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

        //Act
        String response = mockMvc.perform(get("/api/client/projects/" + project.getId() + "/applications/all").session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse().getContentAsString();

        List<Object> responseList = objectMapper.readValue(response, List.class);

        //Assert
        assertThat(responseList).isEmpty();
    }


    @Test
    void selectFreelancerChangesApplicationStatusAndProjectStatusIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        User freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));

        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));

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
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        User freelancer1 = userRepository.save(EntityCreationHelper.createFreelancer(1));

        User freelancer2 = userRepository.save(EntityCreationHelper.createFreelancer(2));

        Application application1 = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer1));

        Application application2 = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer2));

        //Act
        mockMvc.perform(post("/api/client/applications/" + application1.getId() + "/select-freelancer").session(session))
                .andExpect(status().isOk());

        assertThat(applicationRepository.findById(application2.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
    }


    @Test
    void rejectApplicationIsOk() throws Exception {
        //Arrange
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        User freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));

        Application application = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer));

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
        Project project = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        User freelancer1 = userRepository.save(EntityCreationHelper.createFreelancer(1));

        User freelancer2 = userRepository.save(EntityCreationHelper.createFreelancer(2));

        Application application1 = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer1));

        Application application2 = applicationRepository.save(EntityCreationHelper.createApplication(project, freelancer2));

        //Act
        mockMvc.perform(post("/api/client/applications/bulk/reject-freelancer")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(application1.getId(), application2.getId()))))
                .andExpect(status().isPartialContent());

        //Assert
        assertThat(applicationRepository.findById(application1.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
        assertThat(applicationRepository.findById(application2.getId()).get().getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
    }

    @Test
    void getFreelancerProfileReturnsOk() throws Exception {
        //Arrange
        User freelancer = userRepository.save(EntityCreationHelper.createFreelancer(1));

        //Act
        String response = mockMvc.perform(get("/api/public/freelancer/profile/" + freelancer.getUsername()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> profileResponse = objectMapper.readValue(response, LinkedHashMap.class);
        assertThat(profileResponse).containsEntry("userId", freelancer.getId().intValue());
    }

    @Test
    void getFreelancerProfileWhenNotExistReturnsNotFound() throws Exception {
        //Arrange
        String nonExistantUsername = "IDoNotExist";

        //Act
        String response = mockMvc.perform(get("/api/public/freelancer/profile/" + nonExistantUsername))
                .andExpect(status().is4xxClientError())
                .andReturn()
                .getResponse()
                .getContentAsString();

        //Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Freelancer not found");
    }

    @Test
    void getAllAvailableFreelancersReturnsOk() throws Exception {
        // Arrange
        User freelancer1 = userRepository.save(EntityCreationHelper.createFreelancer(1));
        User freelancer2 = userRepository.save(EntityCreationHelper.createFreelancer(2));

        FreelancerProfileFilterDto filters = new FreelancerProfileFilterDto();
        PageableRequestDto pageableRequest = new PageableRequestDto();
        pageableRequest.setPage(0);
        pageableRequest.setSize(10);

        // Act
        String response = mockMvc.perform(get("/api/client/freelancers/all")
                        .session(session)
                        .param("page", String.valueOf(pageableRequest.getPage()))
                        .param("size", String.valueOf(pageableRequest.getSize()))
                        .param("sortDirection", "asc")
                        .content(objectMapper.writeValueAsString(filters)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");

        assertThat(content).hasSize(2);

        Map<String, Object> freelancerResponse1 = content.get(0);
        Map<String, Object> freelancerResponse2 = content.get(1);

        assertThat(freelancerResponse1).containsEntry("userId", freelancer1.getId().intValue());

        assertThat(freelancerResponse2).containsEntry("userId", freelancer2.getId().intValue());


    }

    @Test
    void getAllAvailableFreelancersWithNoFreelancersReturnsEmptyList() throws Exception {
        // Arrange
        FreelancerProfileFilterDto filters = new FreelancerProfileFilterDto();
        PageableRequestDto pageableRequest = new PageableRequestDto();
        pageableRequest.setPage(0);
        pageableRequest.setSize(10);

        // Act
        String response = mockMvc.perform(get("/api/client/freelancers/all")
                        .session(session)
                        .param("page", String.valueOf(pageableRequest.getPage()))
                        .param("size", String.valueOf(pageableRequest.getSize()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(filters)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");

        assertThat(content).isEmpty();
    }
}