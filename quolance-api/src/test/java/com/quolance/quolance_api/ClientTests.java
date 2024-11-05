package com.quolance.quolance_api;

import com.quolance.quolance_api.controllers.ClientController;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import com.quolance.quolance_api.entities.enums.Tag;


import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ClientTests {

    @Autowired
    private ClientController clientController;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientService clientService;

    private ProjectDto sampleProjectDto;

    @BeforeEach
    void setup() {

        projectRepository.deleteAll();
        userRepository.deleteAll();

        userRepository.save(User.builder()
                .id(1L)
                .creationDate(LocalDateTime.now())
                .firstName("Client")
                .lastName("Test")
                .email("clienttest@gmail.com")
                .password("password")
                .role(Role.CLIENT)
                .build());



        sampleProjectDto = ProjectDto.builder()
                .description("test description")
                .clientId(1L)
                .tags(List.of(Tag.PYTHON, Tag.UI))
                .build();
    }

    @Test
    public void testCreateProject() {
        //Creating a project
        ResponseEntity<ProjectDto> response = clientController.createProject(sampleProjectDto);

        //Response Validation
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(sampleProjectDto.getTags(),response.getBody().getTags());
        assertEquals(sampleProjectDto.getDescription(), response.getBody().getDescription());
        assertEquals(sampleProjectDto.getClientId(), response.getBody().getClientId());
    }

    @Test
    public void testGetAllProjects() throws InterruptedException {

        ProjectDto project1 = ProjectDto.builder()
                .description("test description")
                .clientId(1L)
                .build();


        ProjectDto project2 = ProjectDto.builder()
                .description("test description 2")
                .clientId(1L)
                .build();

        clientController.createProject(project1);
        Thread.sleep(100); //delay for creation time
        clientController.createProject(project2);


        ResponseEntity<List<ProjectDto>> response = clientController.getAllMyProjects(1L);

        // Validate the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());

        // Validate Content
        ProjectDto retrievedProject = response.getBody().get(0);
        assertEquals(project1.getDescription(), retrievedProject.getDescription());
        assertEquals(project1.getClientId(), retrievedProject.getClientId());

        ProjectDto retrievedProject2 = response.getBody().get(1);
        assertEquals(project2.getDescription(), retrievedProject2.getDescription());
        assertEquals(project2.getClientId(), retrievedProject2.getClientId());


    }

    @Test
    public void testGetAllProjectsNonExistingClient() {

        //Client that does not exist
        Long nonExistingClientId = 999L;
        ResponseEntity<List<ProjectDto>> response = clientController.getAllMyProjects(nonExistingClientId);

        // Expects Empty List
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    public void testGetAllProjectsForClientWithNoProjects() {

        ResponseEntity<List<ProjectDto>> response = clientController.getAllMyProjects(1L);
        //Expects Empty List
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }


}
