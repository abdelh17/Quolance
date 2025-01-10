package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.FreelancerController;
import com.quolance.quolance_api.dtos.PageResponseDto;
import com.quolance.quolance_api.dtos.PageableRequestDto;
import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
import com.quolance.quolance_api.util.PaginationUtils;
import com.quolance.quolance_api.util.SecurityUtil;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private PaginationUtils paginationUtils;

    @Mock
    private ApplicationProcessWorkflow applicationProcessWorkflow;

    @InjectMocks
    private FreelancerController freelancerController;

    private User mockFreelancer;
    private ApplicationCreateDto applicationCreateDto;
    private ApplicationDto applicationDto;
    private ProjectPublicDto projectPublicDto;
    private ProjectDto projectDto;

    @BeforeEach
    void setUp() {
        mockFreelancer = new User();
        mockFreelancer.setId(1L);
        mockFreelancer.setEmail("freelancer@test.com");
        mockFreelancer.setRole(Role.FREELANCER);

        applicationCreateDto = new ApplicationCreateDto(1L);
        projectDto = new ProjectDto();
        projectDto.setId(1L);
        projectDto.setTitle("Test Project");

        applicationDto = ApplicationDto.builder()
                .id(1L)
                .freelancerId(1L)
                .projectTitle(projectDto.getTitle())
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
            Pageable pageable = PageRequest.of(0, 10);
            Page<ApplicationDto> applicationPage = new PageImpl<>(applications, pageable, applications.size());

            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            when(freelancerWorkflowService.getAllFreelancerApplications(any(User.class),eq(pageable))).thenReturn(applicationPage);

            ResponseEntity<PageResponseDto<ApplicationDto>> response = freelancerController.getAllFreelancerApplications(new PageableRequestDto());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            assertThat(response.getBody().getContent().get(0)).isEqualTo(applicationDto);
            assertThat(response.getBody().getContent().get(0).getStatus()).isEqualTo(ApplicationStatus.APPLIED);
            verify(freelancerWorkflowService).getAllFreelancerApplications(eq(mockFreelancer), eq(pageable));
        }
    }

    @Test
    void getAllFreelancerApplications_ReturnsEmptyList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            Pageable pageable = PageRequest.of(0, 10);
            Page<ApplicationDto> emptyPage = Page.empty(pageable);

            when(freelancerWorkflowService.getAllFreelancerApplications(any(User.class), eq(pageable)))
                    .thenReturn(emptyPage);

            ResponseEntity<PageResponseDto<ApplicationDto>> response = freelancerController.getAllFreelancerApplications(new PageableRequestDto());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).isEmpty();
            verify(freelancerWorkflowService).getAllFreelancerApplications(eq(mockFreelancer), eq(pageable));
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