package com.quolance.quolance_api.unit;

import com.quolance.quolance_api.controllers.ClientController;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.ClientWorkflowService;
import com.quolance.quolance_api.util.SecurityUtil;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientControllerUnitTest {

    @Mock
    private ClientWorkflowService clientWorkflowService;

    @Mock
    private ApplicationProcessWorkflow applicationProcessWorkflow;

    @InjectMocks
    private ClientController clientController;

    private User mockClient;
    private ProjectCreateDto projectCreateDto;
    private ProjectDto projectDto;
    private ProjectUpdateDto projectUpdateDto;

    @BeforeEach
    void setUp() {
        mockClient = new User();
        mockClient.setId(1L);
        mockClient.setEmail("client@test.com");
        mockClient.setRole(Role.CLIENT);

        projectCreateDto = ProjectCreateDto.builder()
                .title("Test Project")
                .description("Test Description")
                .category(ProjectCategory.APP_DEVELOPMENT)
                .priceRange(PriceRange.LESS_500)
                .experienceLevel(FreelancerExperienceLevel.JUNIOR)
                .expectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE)
                .expirationDate(LocalDate.now().plusDays(7))
                .build();

        projectDto = ProjectDto.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .category(ProjectCategory.APP_DEVELOPMENT)
                .priceRange(PriceRange.LESS_500)
                .experienceLevel(FreelancerExperienceLevel.JUNIOR)
                .expectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE)
                .build();

        projectUpdateDto = ProjectUpdateDto.builder()
                .title("Updated Project")
                .description("Updated Description")
                .category(ProjectCategory.CONTENT_WRITING)
                .priceRange(PriceRange.MORE_10000)
                .experienceLevel(FreelancerExperienceLevel.EXPERT)
                .expectedDeliveryTime(ExpectedDeliveryTime.IMMEDIATELY)
                .build();
    }

    @Test
    void createProject_ReturnsSuccessMessage() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doNothing().when(clientWorkflowService).createProject(eq(projectCreateDto), any(User.class));

            // Act
            ResponseEntity<String> response = clientController.createProject(projectCreateDto);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Project created successfully");
            verify(clientWorkflowService).createProject(eq(projectCreateDto), eq(mockClient));
        }
    }

    @Test
    void createProject_WithNullProjectDto_ThrowsException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new ApiException("Project details cannot be null"))
                    .when(clientWorkflowService).createProject(eq(null), any(User.class));

            // Act & Assert
            assertThatThrownBy(() -> clientController.createProject(null))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Project details cannot be null");
        }
    }

    @Test
    void createProject_WhenUnauthorized_ThrowsAccessDeniedException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new AccessDeniedException("User not authorized to create projects"))
                    .when(clientWorkflowService).createProject(eq(projectCreateDto), any(User.class));

            // Act & Assert
            assertThatThrownBy(() -> clientController.createProject(projectCreateDto))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("User not authorized to create projects");
            verify(clientWorkflowService).createProject(eq(projectCreateDto), eq(mockClient));
        }
    }

    @Test
    void getProject_ReturnsProjectDto() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.getProject(eq(1L), any(User.class))).thenReturn(projectDto);

            // Act
            ResponseEntity<ProjectDto> response = clientController.getProject(1L);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(projectDto);
            verify(clientWorkflowService).getProject(eq(1L), eq(mockClient));
        }
    }

    @Test
    void getProject_WithInvalidId_ThrowsApiException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.getProject(eq(-1L), any(User.class)))
                    .thenThrow(new ApiException("Invalid project ID"));

            // Act & Assert
            assertThatThrownBy(() -> clientController.getProject(-1L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Invalid project ID");
            verify(clientWorkflowService).getProject(eq(-1L), eq(mockClient));
        }
    }

    @Test
    void updateProject_ReturnsUpdatedProject() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.updateProject(eq(1L), eq(projectUpdateDto), any(User.class)))
                    .thenReturn(projectDto);

            // Act
            ResponseEntity<ProjectDto> response = clientController.updateProject(1L, projectUpdateDto);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(projectDto);
            verify(clientWorkflowService).updateProject(eq(1L), eq(projectUpdateDto), eq(mockClient));
        }
    }

    @Test
    void updateProject_WhenUnauthorized_ThrowsAccessDeniedException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.updateProject(eq(1L), eq(projectUpdateDto), any(User.class)))
                    .thenThrow(new AccessDeniedException("User not authorized to update this project"));

            // Act & Assert
            assertThatThrownBy(() -> clientController.updateProject(1L, projectUpdateDto))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("User not authorized to update this project");
            verify(clientWorkflowService).updateProject(eq(1L), eq(projectUpdateDto), eq(mockClient));
        }
    }

    @Test
    void deleteProject_ReturnsSuccessMessage() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doNothing().when(clientWorkflowService).deleteProject(eq(1L), any(User.class));

            // Act
            ResponseEntity<String> response = clientController.deleteProject(1L);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Project deleted successfully");
            verify(clientWorkflowService).deleteProject(eq(1L), eq(mockClient));
        }
    }

    @Test
    void deleteProject_WhenProjectNotFound_ThrowsApiException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new ApiException("Project not found"))
                    .when(clientWorkflowService).deleteProject(eq(999L), any(User.class));

            // Act & Assert
            assertThatThrownBy(() -> clientController.deleteProject(999L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Project not found");
            verify(clientWorkflowService).deleteProject(eq(999L), eq(mockClient));
        }
    }

    @Test
    void getAllClientProjects_ReturnsProjectList() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.getAllClientProjects(any(User.class)))
                    .thenReturn(Arrays.asList(projectDto));

            // Act
            ResponseEntity<List<ProjectDto>> response = clientController.getAllClientProjects();

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).hasSize(1);
            assertThat(response.getBody().get(0)).isEqualTo(projectDto);
            verify(clientWorkflowService).getAllClientProjects(eq(mockClient));
        }
    }

    @Test
    void getAllClientProjects_ReturnsEmptyList() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.getAllClientProjects(any(User.class)))
                    .thenReturn(List.of());

            // Act
            ResponseEntity<List<ProjectDto>> response = clientController.getAllClientProjects();

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEmpty();
            verify(clientWorkflowService).getAllClientProjects(eq(mockClient));
        }
    }

    @Test
    void getAllApplicationsToProject_ReturnsApplicationList() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            ApplicationDto applicationDto = new ApplicationDto(); // Create with necessary fields
            when(clientWorkflowService.getAllApplicationsToProject(eq(1L), any(User.class)))
                    .thenReturn(Arrays.asList(applicationDto));

            // Act
            ResponseEntity<List<ApplicationDto>> response = clientController.getAllApplicationsToProject(1L);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).hasSize(1);
            verify(clientWorkflowService).getAllApplicationsToProject(eq(1L), eq(mockClient));
        }
    }

    @Test
    void getAllApplicationsToProject_WhenProjectNotFound_ThrowsApiException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.getAllApplicationsToProject(eq(999L), any(User.class)))
                    .thenThrow(new ApiException("Project not found"));

            // Act & Assert
            assertThatThrownBy(() -> clientController.getAllApplicationsToProject(999L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Project not found");
            verify(clientWorkflowService).getAllApplicationsToProject(eq(999L), eq(mockClient));
        }
    }

    @Test
    void selectFreelancer_ReturnsSuccessMessage() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doNothing().when(applicationProcessWorkflow).selectFreelancer(eq(1L), any(User.class));

            // Act
            ResponseEntity<String> response = clientController.selectFreelancer(1L);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Freelancer selected successfully");
            verify(applicationProcessWorkflow).selectFreelancer(eq(1L), eq(mockClient));
        }
    }

    @Test
    void selectFreelancer_WhenApplicationNotFound_ThrowsApiException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new ApiException("Application not found"))
                    .when(applicationProcessWorkflow).selectFreelancer(eq(999L), any(User.class));

            // Act & Assert
            assertThatThrownBy(() -> clientController.selectFreelancer(999L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application not found");
            verify(applicationProcessWorkflow).selectFreelancer(eq(999L), eq(mockClient));
        }
    }

    @Test
    void rejectFreelancer_ReturnsSuccessMessage() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doNothing().when(applicationProcessWorkflow).rejectApplication(eq(1L), any(User.class));

            // Act
            ResponseEntity<String> response = clientController.rejectFreelancer(1L);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Freelancer rejected successfully");
            verify(applicationProcessWorkflow).rejectApplication(eq(1L), eq(mockClient));
        }
    }

    @Test
    void rejectManyFreelancers_ReturnsSuccessMessage() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            List<Long> applicationIds = Arrays.asList(1L, 2L);
            doNothing().when(applicationProcessWorkflow).rejectManyApplications(eq(applicationIds), any(User.class));

            // Act
            ResponseEntity<String> response = clientController.rejectManyFreelancers(applicationIds);

            // Assert
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("All selected freelancers rejected successfully");
            verify(applicationProcessWorkflow).rejectManyApplications(eq(applicationIds), eq(mockClient));
        }
    }

    @Test
    void rejectManyFreelancers_WithEmptyList_ThrowsApiException() {
        // Arrange
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            List<Long> emptyList = List.of();
            doThrow(new ApiException("Application IDs list cannot be empty"))
                    .when(applicationProcessWorkflow).rejectManyApplications(eq(emptyList), any(User.class));

            // Act & Assert
            assertThatThrownBy(() -> clientController.rejectManyFreelancers(emptyList))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application IDs list cannot be empty");
            verify(applicationProcessWorkflow).rejectManyApplications(eq(emptyList), eq(mockClient));
        }
    }
}