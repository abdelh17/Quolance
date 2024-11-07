package com.quolance.quolance_api;

import com.quolance.quolance_api.controllers.AuthController;
import com.quolance.quolance_api.controllers.ClientController;
import com.quolance.quolance_api.controllers.FreelancerController;
import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.LoginRequestDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.ClientService;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.services.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
public class ClientTests {

    @Autowired
    private ClientService clientService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private FreelancerService freelancerService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private AuthController authController;
    @Autowired
    private ClientController clientController;

    public ProjectDto testProjectDto;
    private User client;

    @BeforeEach
    void setUp() {
        //reset info
        logoutClient();
        projectRepository.deleteAll();
        userRepository.deleteAll();

        //test client
        client = new User();
        client.setFirstName("John");
        client.setLastName("Doe");
        client.setEmail("client@test.com");
        client.setRole(Role.CLIENT);
        client.setVerified(true);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("Password123!");
        client.setPassword(encodedPassword);
        userRepository.save(client);

        //test project
        testProjectDto = ProjectDto.builder()
                .description("Project description")
                .build();
    }

    @Transactional
    @Test
    void testClientLogin(){

        // Create a login request DTO
        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("client@test.com");
        loginRequest.setPassword("Password123!");

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        // Call the login endpoint
        ResponseEntity<?> loginResponse = authController.login(request, response, loginRequest);

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
    }

    @Transactional
    @Test
    void testCreateProject() {
        loginClient();

        //Create Project Request
        ResponseEntity<ProjectDto> response = clientController.createProject(testProjectDto);

        //Response Verification
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testProjectDto.getDescription(), response.getBody().getDescription());

        //Service Validation
        ProjectDto savedProject = projectService.getProjectById(response.getBody().getId());
        assertNotNull(savedProject);
        assertEquals(testProjectDto.getDescription(), savedProject.getDescription());

    }

    @Test
    void testGetAllProjects() {
        loginClient();

        // Create a project and Request
        ProjectDto savedProject = clientService.createProject(testProjectDto, client);
        ResponseEntity<List<ProjectDto>> request = clientController.getAllMyProjects();

        // Verify response
        assertEquals(HttpStatus.OK, request.getStatusCode());

        // Verify content
        List<ProjectDto> projects = request.getBody();
        assertNotNull(projects);
        assertEquals(1, projects.size());
        assertEquals(savedProject.getId(), projects.get(0).getId());

    }

    @Test
    @Transactional
    void testGetAllApplicationsToProject(){

        loginClient();

        User freelancer = getTestFreelancer();

        ProjectDto savedProject = clientService.createProject(testProjectDto, client);

        //Application Creation
        ApplicationDto applicationDto = ApplicationDto.builder()
                .status(ApplicationStatus.IN_PROGRESS)
                .projectId(savedProject.getId())
                .freelancerId(freelancer.getId())
                .build();

        //Application Submission
        FreelancerController freelancerController = new FreelancerController(freelancerService);
        freelancerController.applyToProject(applicationDto);

        //Request
        ResponseEntity<List<ApplicationDto>> request = clientController.getAllApplicationsToProject(savedProject.getId());

        //Verify response
        assertEquals(HttpStatus.OK, request.getStatusCode());
        //Verify content
        List<ApplicationDto> applications = request.getBody();
        assertNotNull(applications);
        assertEquals(1, applications.size());
        assertEquals(applicationDto.getProjectId(), applications.get(0).getProjectId());

    }

    void loginClient(){

        LoginRequestDto loginRequest = new LoginRequestDto();
        loginRequest.setEmail("client@test.com");
        loginRequest.setPassword("Password123!");

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        authController.login(request, response, loginRequest);
    }

    void logoutClient(){

        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        authController.logout(request, response);
    }

    public User getTestFreelancer() {

        User freelancer = User.builder()
                .firstName("Freelancer")
                .lastName("Doe")
                .email("freelancer@test.com")
                .role(Role.FREELANCER)
                .verified(true)
                .password("Password123!")
                .build();

        userRepository.save(freelancer);
        return freelancer;
    }
}
