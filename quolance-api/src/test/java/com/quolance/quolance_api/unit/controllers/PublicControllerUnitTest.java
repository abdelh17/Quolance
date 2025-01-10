package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.PublicController;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PublicControllerUnitTest {

    @Mock
    private FreelancerWorkflowService freelancerWorkflowService;

    @InjectMocks
    private PublicController publicController;

    private ProjectPublicDto sampleProject;
    private List<ProjectPublicDto> sampleProjects;

    @BeforeEach
    void setUp() {
        sampleProject = ProjectPublicDto.builder()
                .id(1L)
                .title("Sample Project")
                .description("Sample Description")
                .build();

        sampleProjects = Arrays.asList(
                sampleProject,
                ProjectPublicDto.builder()
                        .id(2L)
                        .title("Another Project")
                        .description("Another Description")
                        .build()
        );
    }

    @Test
    void getAllAvailableProjects_ShouldReturnProjects_WhenProjectsExist() {
        when(freelancerWorkflowService.getAllAvailableProjects()).thenReturn(sampleProjects);

        ResponseEntity<List<ProjectPublicDto>> response = publicController.getAllAvailableProjects();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .hasSize(2)
                .isEqualTo(sampleProjects);
        verify(freelancerWorkflowService).getAllAvailableProjects();
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getAllAvailableProjects_ShouldReturnEmptyList_WhenNoProjects() {
        when(freelancerWorkflowService.getAllAvailableProjects()).thenReturn(Collections.emptyList());

        ResponseEntity<List<ProjectPublicDto>> response = publicController.getAllAvailableProjects();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .isEmpty();
        verify(freelancerWorkflowService).getAllAvailableProjects();
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getAllAvailableProjects_ShouldThrowApiException_WhenServiceFails() {
        when(freelancerWorkflowService.getAllAvailableProjects())
                .thenThrow(ApiException.builder()
                        .message("Failed to fetch projects")
                        .status(500)
                        .build());

        assertThatThrownBy(() -> publicController.getAllAvailableProjects())
                .isInstanceOf(ApiException.class)
                .hasMessage("Failed to fetch projects");
        verify(freelancerWorkflowService).getAllAvailableProjects();
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getProjectById_ShouldReturnProject_WhenProjectExists() {
        when(freelancerWorkflowService.getProject(1L)).thenReturn(sampleProject);

        ResponseEntity<ProjectPublicDto> response = publicController.getProjectById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .isEqualTo(sampleProject);
        verify(freelancerWorkflowService).getProject(1L);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getProjectById_ShouldThrowApiException_WhenProjectNotFound() {
        when(freelancerWorkflowService.getProject(anyLong()))
                .thenThrow(ApiException.builder()
                        .message("Project not found")
                        .status(404)
                        .build());

        assertThatThrownBy(() -> publicController.getProjectById(999L))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(freelancerWorkflowService).getProject(999L);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getProjectById_ShouldThrowApiException_WhenServiceFails() {
        when(freelancerWorkflowService.getProject(anyLong()))
                .thenThrow(ApiException.builder()
                        .message("Service unavailable")
                        .status(500)
                        .build());

        assertThatThrownBy(() -> publicController.getProjectById(1L))
                .isInstanceOf(ApiException.class)
                .hasMessage("Service unavailable");
        verify(freelancerWorkflowService).getProject(1L);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }
}