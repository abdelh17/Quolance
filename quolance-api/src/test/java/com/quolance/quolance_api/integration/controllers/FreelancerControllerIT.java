package com.quolance.quolance_api.integration.controllers;

import com.quolance.quolance_api.controllers.FreelancerController;
import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FreelancerControllerIT extends BaseIntegrationTest {

    @Autowired
    private FreelancerController freelancerController;

    private User freelancer;
    private Project project;
    private ProjectDto projectDto;
    private ApplicationDto applicationDto;

    @BeforeEach
    void setUp() {
        super.setUp();

        // Create test data
        freelancer = TestDataBuilder.createTestFreelancer();
        userRepository.save(freelancer);

        User client = TestDataBuilder.createTestClient();
        userRepository.save(client);

        project = TestDataBuilder.createTestProject(client);
        projectRepository.save(project);

        projectDto = ProjectDto.builder()
                .id(project.getId())
                .description(project.getDescription())
                .build();

        applicationDto = ApplicationDto.builder()
                .projectId(projectDto.getId())
                .status(ApplicationStatus.IN_PROGRESS)
                .build();
    }

    @Test
    @Transactional
    void testSubmitApplication() {
        ResponseEntity<ApplicationDto> response = freelancerController.applyToProject(applicationDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ApplicationStatus.IN_PROGRESS, response.getBody().getStatus());
        assertEquals(projectDto.getId(), response.getBody().getProjectId());
        assertEquals(freelancer.getId(), response.getBody().getFreelancerId());
    }

    @Test
    @Transactional
    void testGetAllMyApplications() {
        freelancerController.applyToProject(applicationDto);

        ResponseEntity<List<ApplicationDto>> response = freelancerController.getAllMyApplications();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(ApplicationStatus.IN_PROGRESS, response.getBody().get(0).getStatus());
        assertEquals(projectDto.getId(), response.getBody().get(0).getProjectId());
        assertEquals(freelancer.getId(), response.getBody().get(0).getFreelancerId());
    }

    @Test
    @Transactional
    void testViewAllProjects() {
        ResponseEntity<List<ProjectDto>> response = freelancerController.getAllProjects();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(projectDto.getId(), response.getBody().get(0).getId());
        assertEquals(projectDto.getDescription(), response.getBody().get(0).getDescription());
    }

    @Test
    @Transactional
    void testViewAProjectByID() {
        ResponseEntity<ProjectDto> response = freelancerController.getProjectById(projectDto.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(projectDto.getId(), response.getBody().getId());
        assertEquals(projectDto.getDescription(), response.getBody().getDescription());
    }
}