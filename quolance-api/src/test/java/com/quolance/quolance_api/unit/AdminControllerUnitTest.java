package com.quolance.quolance_api.unit;

import com.quolance.quolance_api.controllers.AdminController;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.services.business_workflow.AdminWorkflowService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerUnitTest {

    @Mock
    private AdminWorkflowService adminWorkflowService;

    @InjectMocks
    private AdminController adminController;

    private ProjectDto projectDto1;
    private ProjectDto projectDto2;

    @BeforeEach
    void setUp() {
        projectDto1 = new ProjectDto();
        projectDto1.setId(1L);
        projectDto2 = new ProjectDto();
        projectDto2.setId(2L);
    }

    @Test
    void getAllPendingProjects_ReturnsListOfProjects() {
        // Arrange
        List<ProjectDto> expectedProjects = Arrays.asList(projectDto1, projectDto2);
        when(adminWorkflowService.getAllPendingProjects()).thenReturn(expectedProjects);

        // Act
        ResponseEntity<List<ProjectDto>> response = adminController.getAllPendingProjects();

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expectedProjects);
        verify(adminWorkflowService, times(1)).getAllPendingProjects();
    }

    @Test
    void getAllPendingProjects_ReturnsEmptyList_WhenNoProjects() {
        // Arrange
        when(adminWorkflowService.getAllPendingProjects()).thenReturn(List.of());

        // Act
        ResponseEntity<List<ProjectDto>> response = adminController.getAllPendingProjects();

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
        verify(adminWorkflowService, times(1)).getAllPendingProjects();
    }

    @Test
    void getAllPendingProjects_WhenUnauthorized_ThrowsAccessDeniedException() {
        // Arrange
        when(adminWorkflowService.getAllPendingProjects())
                .thenThrow(new AccessDeniedException("User is not authorized to view pending projects"));

        // Act & Assert
        assertThatThrownBy(() -> adminController.getAllPendingProjects())
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("User is not authorized to view pending projects");
        verify(adminWorkflowService, times(1)).getAllPendingProjects();
    }

    @Test
    void approveProject_ReturnsSuccessMessage() {
        // Arrange
        Long projectId = 1L;
        doNothing().when(adminWorkflowService).approveProject(projectId);

        // Act
        ResponseEntity<String> response = adminController.approveProject(projectId);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Project approved successfully");
        verify(adminWorkflowService, times(1)).approveProject(projectId);
    }

    @Test
    void approveProject_WhenProjectNotFound_ThrowsApiException() {
        // Arrange
        Long projectId = 999L;
        doThrow(new ApiException("Project not found")).when(adminWorkflowService).approveProject(projectId);

        // Act & Assert
        assertThatThrownBy(() -> adminController.approveProject(projectId))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(adminWorkflowService, times(1)).approveProject(projectId);
    }

    @Test
    void approveProject_WhenUnauthorized_ThrowsAccessDeniedException() {
        // Arrange
        Long projectId = 1L;
        doThrow(new AccessDeniedException("User is not authorized to approve projects"))
                .when(adminWorkflowService).approveProject(projectId);

        // Act & Assert
        assertThatThrownBy(() -> adminController.approveProject(projectId))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("User is not authorized to approve projects");
        verify(adminWorkflowService, times(1)).approveProject(projectId);
    }

    @Test
    void rejectProject_ReturnsSuccessMessage() {
        // Arrange
        Long projectId = 1L;
        doNothing().when(adminWorkflowService).rejectProject(projectId);

        // Act
        ResponseEntity<String> response = adminController.rejectProject(projectId);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Project rejected successfully");
        verify(adminWorkflowService, times(1)).rejectProject(projectId);
    }

    @Test
    void rejectProject_WhenProjectNotFound_ThrowsApiException() {
        // Arrange
        Long projectId = 999L;
        doThrow(new ApiException("Project not found")).when(adminWorkflowService).rejectProject(projectId);

        // Act & Assert
        assertThatThrownBy(() -> adminController.rejectProject(projectId))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(adminWorkflowService, times(1)).rejectProject(projectId);
    }

    @Test
    void rejectProject_WhenUnauthorized_ThrowsAccessDeniedException() {
        // Arrange
        Long projectId = 1L;
        doThrow(new AccessDeniedException("User is not authorized to reject projects"))
                .when(adminWorkflowService).rejectProject(projectId);

        // Act & Assert
        assertThatThrownBy(() -> adminController.rejectProject(projectId))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("User is not authorized to reject projects");
        verify(adminWorkflowService, times(1)).rejectProject(projectId);
    }
}