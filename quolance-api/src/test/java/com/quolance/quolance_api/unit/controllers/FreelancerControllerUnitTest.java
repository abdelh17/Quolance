package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.FreelancerController;
import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.paging.PageResponseDto;
import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.profile.UpdateFreelancerProfileDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectCategory;
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
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
    private String applicationMessage;

    @BeforeEach
    void setUp() {
        mockFreelancer = new User();
        mockFreelancer.setId(UUID.randomUUID());
        mockFreelancer.setEmail("freelancer@test.com");
        mockFreelancer.setRole(Role.FREELANCER);

        projectDto = new ProjectDto();
        projectDto.setId(UUID.randomUUID());
        projectDto.setTitle("Test Project");

        applicationMessage = "Test Application Message";
        applicationCreateDto = new ApplicationCreateDto(projectDto.getId(), applicationMessage);


        applicationDto = ApplicationDto.builder()
                .id(projectDto.getId())
                .freelancerId(mockFreelancer.getId())
                .projectTitle(projectDto.getTitle())
                .status(ApplicationStatus.APPLIED)
                .build();

        projectPublicDto = new ProjectPublicDto();
        projectPublicDto.setId(UUID.randomUUID());
        projectPublicDto.setTitle("Test Project");
    }

    @Test
    void applyToProject_CallsService() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doNothing().when(freelancerWorkflowService).submitApplication(eq(applicationCreateDto), any(User.class));

            freelancerController.applyToProject(applicationCreateDto);

            verify(freelancerWorkflowService).submitApplication(applicationCreateDto, mockFreelancer);
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
            when(freelancerWorkflowService.getApplication(eq(applicationDto.getId()), any(User.class))).thenReturn(applicationDto);

            ResponseEntity<ApplicationDto> response = freelancerController.getApplication(applicationDto.getId());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(applicationDto);
            assertThat(response.getBody().getStatus()).isEqualTo(ApplicationStatus.APPLIED);
            verify(freelancerWorkflowService).getApplication(applicationDto.getId(), mockFreelancer);
        }
    }

    @Test
    void deleteApplication_ReturnsSuccessMessage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            UUID applicationId = UUID.randomUUID();
            doNothing().when(applicationProcessWorkflow).cancelApplication(eq(applicationId), any(User.class));

            ResponseEntity<String> response = freelancerController.deleteApplication(applicationId);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Application deleted successfully.");
            verify(applicationProcessWorkflow).cancelApplication(applicationId, mockFreelancer);
        }
    }

    @Test
    void deleteApplication_WithInvalidId_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            UUID invalidId = UUID.randomUUID();
            doThrow(new ApiException("Application not found"))
                    .when(applicationProcessWorkflow).cancelApplication(eq(invalidId), any(User.class));

            assertThatThrownBy(() -> freelancerController.deleteApplication(invalidId))
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
            when(freelancerWorkflowService.getAllFreelancerApplications(any(User.class), eq(pageable))).thenReturn(applicationPage);

            ResponseEntity<PageResponseDto<ApplicationDto>> response = freelancerController.getAllFreelancerApplications(new PageableRequestDto());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            assertThat(response.getBody().getContent().get(0)).isEqualTo(applicationDto);
            assertThat(response.getBody().getContent().get(0).getStatus()).isEqualTo(ApplicationStatus.APPLIED);
            verify(freelancerWorkflowService).getAllFreelancerApplications(mockFreelancer, pageable);
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
            verify(freelancerWorkflowService).getAllFreelancerApplications(mockFreelancer, pageable);
        }
    }

    @Test
    void getAllVisibleProjects_ReturnsProjectPage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            Page<ProjectPublicDto> projectPage = new PageImpl<>(Arrays.asList(projectPublicDto));
            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            when(freelancerWorkflowService.getAllVisibleProjects(any(Pageable.class), any(ProjectFilterDto.class)))
                    .thenReturn(projectPage);

            ResponseEntity<PageResponseDto<ProjectPublicDto>> response = freelancerController.getAllVisibleProjects(pageableRequestDto, new ProjectFilterDto());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            assertThat(response.getBody().getContent().get(0)).isEqualTo(projectPublicDto);
            verify(freelancerWorkflowService).getAllVisibleProjects(any(Pageable.class), any(ProjectFilterDto.class));
        }
    }

    @Test
    void getAllVisibleProjects_ReturnsEmptyPage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            Page<ProjectPublicDto> emptyPage = new PageImpl<>(Collections.emptyList());
            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            when(freelancerWorkflowService.getAllVisibleProjects(any(Pageable.class), any(ProjectFilterDto.class)))
                    .thenReturn(emptyPage);

            ResponseEntity<PageResponseDto<ProjectPublicDto>> response = freelancerController.getAllVisibleProjects(pageableRequestDto, new ProjectFilterDto());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).isEmpty();
            verify(freelancerWorkflowService).getAllVisibleProjects(any(Pageable.class), any(ProjectFilterDto.class));
        }
    }

    @Test
    void getAllVisibleProjects_WithSpecificFilters_ReturnsFilteredProjectList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            ProjectFilterDto filters = new ProjectFilterDto();
            filters.setCategory(ProjectCategory.WEB_DEVELOPMENT);
            Page<ProjectPublicDto> projectPage = new PageImpl<>(List.of(projectPublicDto));
            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            when(freelancerWorkflowService.getAllVisibleProjects(any(Pageable.class), eq(filters)))
                    .thenReturn(projectPage);

            ResponseEntity<PageResponseDto<ProjectPublicDto>> response = freelancerController.getAllVisibleProjects(pageableRequestDto, filters);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            verify(freelancerWorkflowService).getAllVisibleProjects(any(Pageable.class), eq(filters));
        }
    }

    @Test
    void getProjectById_ReturnsProject() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            when(freelancerWorkflowService.getProject(projectPublicDto.getId())).thenReturn(projectPublicDto);

            ResponseEntity<ProjectPublicDto> response = freelancerController.getProjectById(projectPublicDto.getId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(projectPublicDto);
            verify(freelancerWorkflowService).getProject(projectPublicDto.getId());
        }
    }

    @Test
    void updateFreelancerProfile_WithInvalidData_ReturnsBadRequest() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            UpdateFreelancerProfileDto invalidProfileDto = new UpdateFreelancerProfileDto();
            invalidProfileDto.setContactEmail("invalid-email");

            doThrow(new ApiException("Invalid profile data"))
                    .when(freelancerWorkflowService).updateFreelancerProfile(eq(invalidProfileDto), any(User.class));

            assertThatThrownBy(() -> freelancerController.updateFreelancerProfile(invalidProfileDto))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Invalid profile data");
        }
    }

    @Test
    void applyToProject_WhenAlreadyApplied_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doThrow(new ApiException("Already applied to this project"))
                    .when(freelancerWorkflowService).submitApplication(eq(applicationCreateDto), any(User.class));

            assertThatThrownBy(() -> freelancerController.applyToProject(applicationCreateDto))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Already applied to this project");
        }
    }

    @Test
    void updateFreelancerProfile_ReturnsSuccessMessage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            UpdateFreelancerProfileDto profileDto = new UpdateFreelancerProfileDto();
            doNothing().when(freelancerWorkflowService).updateFreelancerProfile(eq(profileDto), any(User.class));

            ResponseEntity<String> response = freelancerController.updateFreelancerProfile(profileDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Profile updated successfully");
            verify(freelancerWorkflowService).updateFreelancerProfile(profileDto, mockFreelancer);
        }
    }

    @Test
    void deleteApplication_WhenAlreadyProcessed_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID applicationId = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doThrow(new ApiException("Cannot delete processed application"))
                    .when(applicationProcessWorkflow).cancelApplication(eq(applicationId), any(User.class));

            assertThatThrownBy(() -> freelancerController.deleteApplication(applicationId))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Cannot delete processed application");
        }
    }

    @Test
    void getAllVisibleProjects_WithInvalidPageSize_UsesDefaultSize() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(-1);
            ProjectFilterDto filters = new ProjectFilterDto();

            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            when(freelancerWorkflowService.getAllVisibleProjects(any(Pageable.class), eq(filters)))
                    .thenReturn(new PageImpl<>(List.of(projectPublicDto)));

            ResponseEntity<PageResponseDto<ProjectPublicDto>> response =
                    freelancerController.getAllVisibleProjects(pageableRequestDto, filters);

            assertThat(response.getBody().getContent()).hasSize(1);
            verify(paginationUtils).createPageable(pageableRequestDto);
        }
    }

    @Test
    void getApplication_WhenNotOwnApplication_ThrowsAccessDeniedException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID applicationId = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            when(freelancerWorkflowService.getApplication(eq(applicationId), any(User.class)))
                    .thenThrow(new AccessDeniedException("Cannot view other freelancer's application"));

            assertThatThrownBy(() -> freelancerController.getApplication(applicationId))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Cannot view other freelancer's application");
        }
    }

    @Test
    void getProjectById_WhenProjectClosed_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            UUID projectId = UUID.randomUUID();
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            when(freelancerWorkflowService.getProject(projectId))
                    .thenThrow(new ApiException("Project is no longer available"));

            assertThatThrownBy(() -> freelancerController.getProjectById(projectId))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Project is no longer available");
        }
    }

    @Test
    void updateFreelancerProfile_WithNullProfile_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockFreelancer);
            doThrow(new ApiException("Profile update data cannot be null"))
                    .when(freelancerWorkflowService).updateFreelancerProfile(null, mockFreelancer);

            assertThatThrownBy(() -> freelancerController.updateFreelancerProfile(null))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Profile update data cannot be null");
        }
    }
}