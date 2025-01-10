package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.FreelancerController;
import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FreelancerControllerUnitTest {

    @Mock
    private FreelancerWorkflowService freelancerWorkflowService;

    @Mock
    private ApplicationProcessWorkflow applicationProcessWorkflow;

    @InjectMocks
    private FreelancerController freelancerController;

    private User mockFreelancer;
    private ApplicationCreateDto applicationCreateDto;
    private ApplicationDto applicationDto;
    private ProjectPublicDto projectPublicDto;

    @BeforeEach
    void setUp() {
        mockFreelancer = new User();
        mockFreelancer.setId(1L);
        mockFreelancer.setEmail("freelancer@test.com");
        mockFreelancer.setRole(Role.FREELANCER);

        applicationCreateDto = new ApplicationCreateDto(1L);

        applicationDto = ApplicationDto.builder()
                .id(1L)
                .freelancerId(1L)
                .projectId(1L)
                .status(ApplicationStatus.APPLIED)
                .build();

        projectPublicDto = new ProjectPublicDto();
        projectPublicDto.setId(1L);
        projectPublicDto.setTitle("Test Project");
    }

    @Test
    void applyToProject_CallsService() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doNothing().when(freelancerWorkflowService).submitApplication(eq(applicationCreateDto), any(User.class));

            freelancerController.applyToProject(applicationCreateDto);

            verify(freelancerWorkflowService).submitApplication(eq(applicationCreateDto), eq(mockFreelancer));
        }
    }

    @Test
    void applyToProject_WithNullDto_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doThrow(new ApiException("Application details cannot be null"))
                    .when(freelancerWorkflowService).submitApplication(eq(null), any(User.class));

            assertThatThrownBy(() -> freelancerController.applyToProject(null))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application details cannot be null");
        }
    }

    @Test
    void applyToProject_WhenUnauthorized_ThrowsAccessDeniedException() {

        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doThrow(new AccessDeniedException("User not authorized to submit applications"))
                    .when(freelancerWorkflowService).submitApplication(eq(applicationCreateDto), any(User.class));

            assertThatThrownBy(() -> freelancerController.applyToProject(applicationCreateDto))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("User not authorized to submit applications");
        }
    }

    @Test
    void getApplication_ReturnsApplicationDto() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            when(freelancerWorkflowService.getApplication(eq(1L), any(User.class))).thenReturn(applicationDto);

            ResponseEntity<ApplicationDto> response = freelancerController.getApplication(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(applicationDto);
            assertThat(response.getBody().getStatus()).isEqualTo(ApplicationStatus.APPLIED);
            verify(freelancerWorkflowService).getApplication(eq(1L), eq(mockFreelancer));
        }
    }

    @Test
    void getApplication_WithInvalidId_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            when(freelancerWorkflowService.getApplication(eq(-1L), any(User.class)))
                    .thenThrow(new ApiException("Invalid application ID"));

            assertThatThrownBy(() -> freelancerController.getApplication(-1L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Invalid application ID");
        }
    }

    @Test
    void deleteApplication_ReturnsSuccessMessage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doNothing().when(applicationProcessWorkflow).cancelApplication(eq(1L), any(User.class));

            ResponseEntity<String> response = freelancerController.deleteApplication(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Application deleted successfully.");
            verify(applicationProcessWorkflow).cancelApplication(eq(1L), eq(mockFreelancer));
        }
    }

    @Test
    void deleteApplication_WithInvalidId_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doThrow(new ApiException("Application not found"))
                    .when(applicationProcessWorkflow).cancelApplication(eq(999L), any(User.class));

            assertThatThrownBy(() -> freelancerController.deleteApplication(999L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application not found");
        }
    }

    @Test
    void getAllFreelancerApplications_ReturnsApplicationList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            List<ApplicationDto> applications = Arrays.asList(applicationDto);
            when(freelancerWorkflowService.getAllFreelancerApplications(any(User.class))).thenReturn(applications);

            ResponseEntity<List<ApplicationDto>> response = freelancerController.getAllFreelancerApplications();

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).hasSize(1);
            assertThat(response.getBody().get(0)).isEqualTo(applicationDto);
            assertThat(response.getBody().get(0).getStatus()).isEqualTo(ApplicationStatus.APPLIED);
            verify(freelancerWorkflowService).getAllFreelancerApplications(eq(mockFreelancer));
        }
    }

    @Test
    void getAllFreelancerApplications_ReturnsEmptyList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            when(freelancerWorkflowService.getAllFreelancerApplications(any(User.class)))
                    .thenReturn(Collections.emptyList());

            ResponseEntity<List<ApplicationDto>> response = freelancerController.getAllFreelancerApplications();

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEmpty();
            verify(freelancerWorkflowService).getAllFreelancerApplications(eq(mockFreelancer));
        }
    }

    @Test
    void getAllAvailableProjects_ReturnsProjectList() {
        List<ProjectPublicDto> projects = Arrays.asList(projectPublicDto);
        when(freelancerWorkflowService.getAllAvailableProjects()).thenReturn(projects);

        ResponseEntity<List<ProjectPublicDto>> response = freelancerController.getAllAvailableProjects();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0)).isEqualTo(projectPublicDto);
        verify(freelancerWorkflowService).getAllAvailableProjects();
    }

    @Test
    void getAllAvailableProjects_ReturnsEmptyList() {
        when(freelancerWorkflowService.getAllAvailableProjects()).thenReturn(Collections.emptyList());

        ResponseEntity<List<ProjectPublicDto>> response = freelancerController.getAllAvailableProjects();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEmpty();
        verify(freelancerWorkflowService).getAllAvailableProjects();
    }

    @Test
    void getProjectById_ReturnsProject() {
        when(freelancerWorkflowService.getProject(1L)).thenReturn(projectPublicDto);

        ResponseEntity<ProjectPublicDto> response = freelancerController.getProjectById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(projectPublicDto);
        verify(freelancerWorkflowService).getProject(1L);
    }

    @Test
    void getProjectById_WithInvalidId_ThrowsApiException() {
        when(freelancerWorkflowService.getProject(-1L))
                .thenThrow(new ApiException("Invalid project ID"));

        assertThatThrownBy(() -> freelancerController.getProjectById(-1L))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid project ID");
        verify(freelancerWorkflowService).getProject(-1L);
    }
}