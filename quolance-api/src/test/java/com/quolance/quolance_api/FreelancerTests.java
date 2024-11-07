package com.quolance.quolance_api;

import com.quolance.quolance_api.controllers.AuthController;
import com.quolance.quolance_api.controllers.ClientController;
import com.quolance.quolance_api.controllers.FreelancerController;
import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class FreelancerTests {


    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private AuthController authController;
    @Autowired
    private ClientController clientController;
    @Autowired
    private FreelancerController freelancerController;

    public ProjectDto testProjectDto;
    public ApplicationDto testApplicationDto;
    private User freelancer;

    @BeforeEach
    void setUp() {
        //reset info
        logoutFreelancer();
        projectRepository.deleteAll();
        applicationRepository.deleteAll();
        userRepository.deleteAll();

        //test client
        freelancer = new User();
        freelancer.setFirstName("Freelancer");
        freelancer.setLastName("Tester");
        freelancer.setEmail("freelancer@test.com");
        freelancer.setRole(Role.FREELANCER);
        freelancer.setVerified(true);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("Password123!");
        freelancer.setPassword(encodedPassword);
        userRepository.save(freelancer);
        createClientAndProject();

        //test application
        testApplicationDto = ApplicationDto.builder()
                .projectId(testProjectDto.getId())
                .id(1L)
                .status(ApplicationStatus.IN_PROGRESS)
                .build();

    }

    @Transactional
    @Test
    void testFreelancerLogin(){
        //login request
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("freelancer@test.com");
        loginRequest.setPassword("Password123!");

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        // Call endpoint
        ResponseEntity<?> loginResponse = authController.login(request, response, loginRequest);

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
    }

    @Test
    void testSubmitApplication(){
        loginFreelancer();
        ResponseEntity<ApplicationDto> submitApplicationResponse = freelancerController.applyToProject(testApplicationDto);

        assertEquals(HttpStatus.OK, submitApplicationResponse.getStatusCode());

        assertEquals(ApplicationStatus.IN_PROGRESS, submitApplicationResponse.getBody().getStatus());
        assertEquals(testProjectDto.getId(), submitApplicationResponse.getBody().getProjectId());
        assertEquals(freelancer.getId(), submitApplicationResponse.getBody().getFreelancerId());

    }

    @Transactional
    @Test
    void testGetAllMyApplications(){
        loginFreelancer();
        freelancerController.applyToProject(testApplicationDto);

        ResponseEntity<List<ApplicationDto>> applicationsResponse = freelancerController.getAllMyApplications();

        assertEquals(HttpStatus.OK, applicationsResponse.getStatusCode());

        assertEquals(1, applicationsResponse.getBody().size());
        assertEquals(ApplicationStatus.IN_PROGRESS, applicationsResponse.getBody().get(0).getStatus());
        assertEquals(testProjectDto.getId(), applicationsResponse.getBody().get(0).getProjectId());
        assertEquals(freelancer.getId(), applicationsResponse.getBody().get(0).getFreelancerId());
    }

    @Transactional
    @Test
    void testViewAllProjects(){
        loginFreelancer();
        ResponseEntity<List<ProjectDto>> projectsResponse = freelancerController.getAllProjects();

        assertEquals(HttpStatus.OK, projectsResponse.getStatusCode());

        assertEquals(1, projectsResponse.getBody().size());
        assertEquals(testProjectDto.getId(), projectsResponse.getBody().get(0).getId());
        assertEquals(testProjectDto.getDescription(), projectsResponse.getBody().get(0).getDescription());
    }

    @Transactional
    @Test
    void testViewAProjectByID(){
        loginFreelancer();
        ResponseEntity<ProjectDto> projectResponse = freelancerController.getProjectById(testProjectDto.getId());

        assertEquals(HttpStatus.OK, projectResponse.getStatusCode());

        assertEquals(testProjectDto.getId(), projectResponse.getBody().getId());
        assertEquals(testProjectDto.getDescription(), projectResponse.getBody().getDescription());
    }


    void loginFreelancer(){

        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("freelancer@test.com");
        loginRequest.setPassword("Password123!");

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        authController.login(request, response, loginRequest);
    }

    void logoutFreelancer(){

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        authController.logout(request, response);
    }


    public void createClientAndProject() {


        User client = new User();
        client.setFirstName("Client");
        client.setLastName("Tester");
        client.setEmail("client@test.com");
        client.setRole(Role.CLIENT);
        client.setVerified(true);
        client.setPassword("Password123!");
        userRepository.save(client);

        Project project = new Project();
        project.setDescription("Project description");
        project.setClient(client);
        project = projectRepository.save(project);

        testProjectDto = ProjectDto.builder()
                .id(project.getId())
                .description(project.getDescription())
                .build();

    }
}
