package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.ClientController;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.paging.PageResponseDto;
import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
import com.quolance.quolance_api.services.business_workflow.ApplicationProcessWorkflow;
import com.quolance.quolance_api.services.business_workflow.ClientWorkflowService;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientControllerUnitTest {

    @Mock
    private ClientWorkflowService clientWorkflowService;

    @Mock
    private ApplicationProcessWorkflow applicationProcessWorkflow;

    @Mock
    private PaginationUtils paginationUtils;


    @InjectMocks
    private ClientController clientController;

    private User mockClient;
    private ProjectCreateDto projectCreateDto;
    private ProjectDto projectDto;
    private ProjectUpdateDto projectUpdateDto;

    @BeforeEach
    void setUp() {
        mockClient = new User();
        mockClient.setId(UUID.randomUUID());
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
                .id(UUID.randomUUID())
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
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doNothing().when(clientWorkflowService).createProject(eq(projectCreateDto), any(User.class));

            ResponseEntity<String> response = clientController.createProject(projectCreateDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Project created successfully");
            verify(clientWorkflowService).createProject(projectCreateDto, mockClient);
        }
    }

    @Test
    void createProject_WithNullProjectDto_ThrowsException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new ApiException("Project details cannot be null"))
                    .when(clientWorkflowService).createProject(eq(null), any(User.class));

            assertThatThrownBy(() -> clientController.createProject(null))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Project details cannot be null");
        }
    }

    @Test
    void createProject_WhenUnauthorized_ThrowsAccessDeniedException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new AccessDeniedException("User not authorized to create projects"))
                    .when(clientWorkflowService).createProject(eq(projectCreateDto), any(User.class));

            assertThatThrownBy(() -> clientController.createProject(projectCreateDto))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("User not authorized to create projects");
            verify(clientWorkflowService).createProject(projectCreateDto, mockClient);
        }
    }

    @Test
    void getProject_ReturnsProjectDto() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.getProject(eq(projectDto.getId()), any(User.class))).thenReturn(projectDto);

            ResponseEntity<ProjectDto> response = clientController.getProject(projectDto.getId());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(projectDto);
            verify(clientWorkflowService).getProject(projectDto.getId(), mockClient);
        }
    }

    @Test
    void updateProject_ReturnsUpdatedProject() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.updateProject(eq(projectDto.getId()), eq(projectUpdateDto), any(User.class)))
                    .thenReturn(projectDto);

            ResponseEntity<ProjectDto> response = clientController.updateProject(projectDto.getId(), projectUpdateDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo(projectDto);
            verify(clientWorkflowService).updateProject(projectDto.getId(), projectUpdateDto, mockClient);
        }
    }

    @Test
    void updateProject_WhenUnauthorized_ThrowsAccessDeniedException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.updateProject(eq(projectDto.getId()), eq(projectUpdateDto), any(User.class)))
                    .thenThrow(new AccessDeniedException("User not authorized to update this project"));

            assertThatThrownBy(() -> clientController.updateProject(projectDto.getId(), projectUpdateDto))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("User not authorized to update this project");
            verify(clientWorkflowService).updateProject(projectDto.getId(), projectUpdateDto, mockClient);
        }
    }

    @Test
    void deleteProject_ReturnsSuccessMessage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doNothing().when(clientWorkflowService).deleteProject(eq(projectDto.getId()), any(User.class));

            ResponseEntity<String> response = clientController.deleteProject(projectDto.getId());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Project deleted successfully");
            verify(clientWorkflowService).deleteProject(projectDto.getId(), mockClient);
        }
    }

    @Test
    void deleteProject_WhenProjectNotFound_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            UUID invalidProjectId = UUID.randomUUID();
            doThrow(new ApiException("Project not found"))
                    .when(clientWorkflowService).deleteProject(eq(invalidProjectId), any(User.class));

            assertThatThrownBy(() -> clientController.deleteProject(invalidProjectId))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Project not found");
            verify(clientWorkflowService).deleteProject(invalidProjectId, mockClient);
        }
    }

    @Test
    void getAllClientProjects_ReturnsProjectList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            Page<ProjectDto> projectPage = new PageImpl<>(Arrays.asList(projectDto));
            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            when(clientWorkflowService.getAllClientProjects(eq(mockClient), any(Pageable.class)))
                    .thenReturn(projectPage);

            ResponseEntity<PageResponseDto<ProjectDto>> response = clientController.getAllClientProjects(pageableRequestDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            assertThat(response.getBody().getContent().get(0)).isEqualTo(projectDto);
            verify(clientWorkflowService).getAllClientProjects(eq(mockClient), any(Pageable.class));
        }
    }

    @Test
    void getAllClientProjects_ReturnsEmptyList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            Page<ProjectDto> emptyPage = new PageImpl<>(List.of());
            when(paginationUtils.createPageable(any(PageableRequestDto.class))).thenReturn(PageRequest.of(0, 10));
            when(clientWorkflowService.getAllClientProjects(eq(mockClient), any(Pageable.class)))
                    .thenReturn(emptyPage);

            ResponseEntity<PageResponseDto<ProjectDto>> response = clientController.getAllClientProjects(pageableRequestDto);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).isEmpty();
            verify(clientWorkflowService).getAllClientProjects(eq(mockClient), any(Pageable.class));
        }
    }

    @Test
    void getAllApplicationsToProject_ReturnsApplicationList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            ApplicationDto applicationDto = new ApplicationDto();
            when(clientWorkflowService.getAllApplicationsToProject(eq(projectDto.getId()), any(User.class)))
                    .thenReturn(Arrays.asList(applicationDto));

            ResponseEntity<List<ApplicationDto>> response = clientController.getAllApplicationsToProject(projectDto.getId());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).hasSize(1);
            verify(clientWorkflowService).getAllApplicationsToProject(projectDto.getId(), mockClient);
        }
    }

    @Test
    void getAllApplicationsToProject_WhenProjectNotFound_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            UUID invalidProjectId = UUID.randomUUID();
            when(clientWorkflowService.getAllApplicationsToProject(eq(invalidProjectId), any(User.class)))
                    .thenThrow(new ApiException("Project not found"));

            assertThatThrownBy(() -> clientController.getAllApplicationsToProject(invalidProjectId))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Project not found");
            verify(clientWorkflowService).getAllApplicationsToProject(invalidProjectId, mockClient);
        }
    }

    @Test
    void selectFreelancer_ReturnsSuccessMessage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            UUID applicationId = UUID.randomUUID();
            doNothing().when(applicationProcessWorkflow).selectFreelancer(eq(applicationId), any(User.class));

            ResponseEntity<String> response = clientController.selectFreelancer(applicationId);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Freelancer selected successfully");
            verify(applicationProcessWorkflow).selectFreelancer(applicationId, mockClient);
        }
    }

    @Test
    void selectFreelancer_WhenApplicationNotFound_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            UUID invalidApplicationId = UUID.randomUUID();
            doThrow(new ApiException("Application not found"))
                    .when(applicationProcessWorkflow).selectFreelancer(eq(invalidApplicationId), any(User.class));

            assertThatThrownBy(() -> clientController.selectFreelancer(invalidApplicationId))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application not found");
            verify(applicationProcessWorkflow).selectFreelancer(invalidApplicationId, mockClient);
        }
    }

    @Test
    void rejectFreelancer_ReturnsSuccessMessage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            UUID applicationId = UUID.randomUUID();
            doNothing().when(applicationProcessWorkflow).rejectApplication(eq(applicationId), any(User.class));

            ResponseEntity<String> response = clientController.rejectFreelancer(applicationId);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("Freelancer rejected successfully");
            verify(applicationProcessWorkflow).rejectApplication(applicationId, mockClient);
        }
    }

    @Test
    void rejectManyFreelancers_ReturnsSuccessMessage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            List<UUID> applicationIds = Arrays.asList(UUID.randomUUID(), UUID.randomUUID());
            doNothing().when(applicationProcessWorkflow).rejectManyApplications(eq(applicationIds), any(User.class));

            ResponseEntity<String> response = clientController.rejectManyFreelancers(applicationIds);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("All selected freelancers rejected successfully");
            verify(applicationProcessWorkflow).rejectManyApplications(applicationIds, mockClient);
        }
    }

    @Test
    void rejectManyFreelancers_WithEmptyList_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            List<UUID> emptyList = List.of();
            doThrow(new ApiException("Application IDs list cannot be empty"))
                    .when(applicationProcessWorkflow).rejectManyApplications(eq(emptyList), any(User.class));

            assertThatThrownBy(() -> clientController.rejectManyFreelancers(emptyList))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application IDs list cannot be empty");
            verify(applicationProcessWorkflow).rejectManyApplications(emptyList, mockClient);
        }
    }

    @Test
    void getAllAvailableFreelancers_ReturnsFreelancerPage() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            FreelancerProfileFilterDto filters = new FreelancerProfileFilterDto();
            Page<FreelancerProfileDto> freelancerPage = new PageImpl<>(List.of(new FreelancerProfileDto()));
            when(clientWorkflowService.getAllAvailableFreelancers(any(PageRequest.class), eq(filters)))
                    .thenReturn(freelancerPage);

            ResponseEntity<PageResponseDto<FreelancerProfileDto>> response = clientController.getAllAvailableFreelancers(pageableRequestDto, filters);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            verify(clientWorkflowService).getAllAvailableFreelancers(any(PageRequest.class), eq(filters));
        }
    }

    @Test
    void getAllAvailableFreelancers_WithInvalidFilters_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            FreelancerProfileFilterDto invalidFilters = new FreelancerProfileFilterDto();
            doThrow(new ApiException("Invalid filters"))
                    .when(clientWorkflowService).getAllAvailableFreelancers(any(PageRequest.class), eq(invalidFilters));

            assertThatThrownBy(() -> clientController.getAllAvailableFreelancers(pageableRequestDto, invalidFilters))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Invalid filters");
            verify(clientWorkflowService).getAllAvailableFreelancers(any(PageRequest.class), eq(invalidFilters));
        }
    }

    @Test
    void getAllAvailableFreelancers_WithPagination_ReturnsPaginatedFreelancerList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(1);
            pageableRequestDto.setSize(5);
            FreelancerProfileFilterDto filters = new FreelancerProfileFilterDto();
            Page<FreelancerProfileDto> freelancerPage = new PageImpl<>(List.of(new FreelancerProfileDto()));
            when(clientWorkflowService.getAllAvailableFreelancers(any(PageRequest.class), eq(filters)))
                    .thenReturn(freelancerPage);

            ResponseEntity<PageResponseDto<FreelancerProfileDto>> response = clientController.getAllAvailableFreelancers(pageableRequestDto, filters);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            verify(clientWorkflowService).getAllAvailableFreelancers(any(PageRequest.class), eq(filters));
        }
    }

    @Test
    void getAllAvailableFreelancers_WithSorting_ReturnsSortedFreelancerList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            FreelancerProfileFilterDto filters = new FreelancerProfileFilterDto();
            Page<FreelancerProfileDto> freelancerPage = new PageImpl<>(List.of(new FreelancerProfileDto()));
            when(clientWorkflowService.getAllAvailableFreelancers(any(PageRequest.class), eq(filters)))
                    .thenReturn(freelancerPage);

            ResponseEntity<PageResponseDto<FreelancerProfileDto>> response = clientController.getAllAvailableFreelancers(pageableRequestDto, filters);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).hasSize(1);
            verify(clientWorkflowService).getAllAvailableFreelancers(any(PageRequest.class), eq(filters));
        }
    }

    @Test
    void getAllAvailableFreelancers_WhenNoFreelancersAvailable_ReturnsEmptyList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            PageableRequestDto pageableRequestDto = new PageableRequestDto();
            pageableRequestDto.setPage(0);
            pageableRequestDto.setSize(10);
            FreelancerProfileFilterDto filters = new FreelancerProfileFilterDto();
            Page<FreelancerProfileDto> emptyPage = new PageImpl<>(List.of());
            when(clientWorkflowService.getAllAvailableFreelancers(any(PageRequest.class), eq(filters)))
                    .thenReturn(emptyPage);

            ResponseEntity<PageResponseDto<FreelancerProfileDto>> response = clientController.getAllAvailableFreelancers(pageableRequestDto, filters);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody().getContent()).isEmpty();
            verify(clientWorkflowService).getAllAvailableFreelancers(any(PageRequest.class), eq(filters));
        }
    }

    @Test
    void rejectManyFreelancers_WithNullList_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new ApiException("Application IDs list cannot be null"))
                    .when(applicationProcessWorkflow).rejectManyApplications(eq(null), any(User.class));

            assertThatThrownBy(() -> clientController.rejectManyFreelancers(null))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application IDs list cannot be null");
            verify(applicationProcessWorkflow).rejectManyApplications(null, mockClient);
        }
    }

    @Test
    void updateProject_WithMissingRequiredFields_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            ProjectUpdateDto invalidUpdateDto = new ProjectUpdateDto();
            when(clientWorkflowService.updateProject(eq(1L), eq(invalidUpdateDto), any(User.class)))
                    .thenThrow(new ApiException("Required fields missing in project update"));

            assertThatThrownBy(() -> clientController.updateProject(1L, invalidUpdateDto))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Required fields missing in project update");
            verify(clientWorkflowService).updateProject(1L, invalidUpdateDto, mockClient);
        }
    }

    @Test
    void createProject_WithPastExpirationDate_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            ProjectCreateDto invalidProject = projectCreateDto;
            invalidProject.setExpirationDate(LocalDate.now().minusDays(1));
            doThrow(new ApiException("Expiration date must be in the future"))
                    .when(clientWorkflowService).createProject(eq(invalidProject), any(User.class));

            assertThatThrownBy(() -> clientController.createProject(invalidProject))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Expiration date must be in the future");
        }
    }

    @Test
    void getAllApplicationsToProject_WithNoApplications_ReturnsEmptyList() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.getAllApplicationsToProject(eq(1L), any(User.class)))
                    .thenReturn(List.of());

            ResponseEntity<List<ApplicationDto>> response = clientController.getAllApplicationsToProject(1L);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEmpty();
            verify(clientWorkflowService).getAllApplicationsToProject(1L, mockClient);
        }
    }

    @Test
    void rejectFreelancer_WhenAlreadyProcessed_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new ApiException("Application already processed"))
                    .when(applicationProcessWorkflow).rejectApplication(eq(1L), any(User.class));

            assertThatThrownBy(() -> clientController.rejectFreelancer(1L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Application already processed");
            verify(applicationProcessWorkflow).rejectApplication(1L, mockClient);
        }
    }

    @Test
    void selectFreelancer_WhenAlreadySelected_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            doThrow(new ApiException("Freelancer already selected for this project"))
                    .when(applicationProcessWorkflow).selectFreelancer(eq(1L), any(User.class));

            assertThatThrownBy(() -> clientController.selectFreelancer(1L))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Freelancer already selected for this project");
            verify(applicationProcessWorkflow).selectFreelancer(1L, mockClient);
        }
    }

    @Test
    void updateProject_WhenProjectInProgress_ThrowsApiException() {
        try (MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class)) {
            securityUtil.when(SecurityUtil::getAuthenticatedUser).thenReturn(mockClient);
            when(clientWorkflowService.updateProject(eq(1L), eq(projectUpdateDto), any(User.class)))
                    .thenThrow(new ApiException("Cannot update project that is already in progress"));

            assertThatThrownBy(() -> clientController.updateProject(1L, projectUpdateDto))
                    .isInstanceOf(ApiException.class)
                    .hasMessage("Cannot update project that is already in progress");
            verify(clientWorkflowService).updateProject(1L, projectUpdateDto, mockClient);
        }
    }
}