package com.quolance.quolance_api.unit.services.business_workflow;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.project.ProjectFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.impl.FreelancerWorkflowServiceImpl;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FreelancerWorkflowServiceUnitTest {

    @Mock
    private ProjectService projectService;

    @Mock
    private ApplicationService applicationService;

    @Mock
    private NotificationMessageService notificationMessageService;

    @InjectMocks
    private FreelancerWorkflowServiceImpl freelancerWorkflowService;

    @Captor
    private ArgumentCaptor<Application> applicationCaptor;

    private User mockFreelancer;
    private Project mockProject;
    private Application mockApplication;
    private String applicationMessage;
    private ApplicationCreateDto applicationCreateDto;

    @BeforeEach
    void setUp() {
        mockFreelancer = User.builder()
                .id(UUID.randomUUID())
                .profile(new Profile())
                .build();

        mockProject = Project.builder()
                .id(UUID.randomUUID())
                .projectStatus(ProjectStatus.OPEN)
                .visibilityExpirationDate(LocalDate.now().plusDays(7))
                .build();

        mockApplication = Application.builder()
                .id(UUID.randomUUID())
                .project(mockProject)
                .freelancer(mockFreelancer)
                .applicationStatus(ApplicationStatus.APPLIED)
                .build();

        applicationMessage = "Test application message";
        applicationCreateDto = new ApplicationCreateDto(mockProject.getId(), applicationMessage);
    }

    @Test
    void submitApplication_Success() {
        when(projectService.getProjectById(mockProject.getId())).thenReturn(mockProject);
        when(applicationService.getApplicationByFreelancerIdAndProjectId(mockFreelancer.getId(), mockProject.getId())).thenReturn(null);

        freelancerWorkflowService.submitApplication(applicationCreateDto, mockFreelancer);

        verify(applicationService).saveApplication(applicationCaptor.capture());
        Application savedApplication = applicationCaptor.getValue();
        assertThat(savedApplication.getFreelancer()).isEqualTo(mockFreelancer);
        assertThat(savedApplication.getProject()).isEqualTo(mockProject);
    }

    @Test
    void submitApplication_AlreadyApplied_ThrowsException() {
        when(applicationService.getApplicationByFreelancerIdAndProjectId(mockFreelancer.getId(), mockProject.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> freelancerWorkflowService.submitApplication(applicationCreateDto, mockFreelancer))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("You have already applied to this project.");
    }

    @Test
    void submitApplication_ProjectNotApproved_ThrowsException() {
        mockProject.setProjectStatus(ProjectStatus.PENDING);
        when(projectService.getProjectById(mockProject.getId())).thenReturn(mockProject);
        when(applicationService.getApplicationByFreelancerIdAndProjectId(mockFreelancer.getId(), mockProject.getId())).thenReturn(null);

        assertThatThrownBy(() -> freelancerWorkflowService.submitApplication(applicationCreateDto, mockFreelancer))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("You can't apply to this project.");
    }

    @Test
    void submitApplication_OptimisticLockException_ThrowsException() {
        when(projectService.getProjectById(mockProject.getId())).thenReturn(mockProject);
        when(applicationService.getApplicationByFreelancerIdAndProjectId(mockFreelancer.getId(), mockProject.getId())).thenReturn(null);
        doThrow(new OptimisticLockException("Version mismatch")).when(applicationService).saveApplication(any());

        // UPDATED: Change expected message to match actual message ("resource" instead of "ressource")
        assertThatThrownBy(() -> freelancerWorkflowService.submitApplication(applicationCreateDto, mockFreelancer))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("The resource was modified by another user. Please refresh the page and try again.");
    }

    @Test
    void getApplication_Success() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        ApplicationDto result = freelancerWorkflowService.getApplication(mockApplication.getId(), mockFreelancer);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(mockApplication.getId());
    }

    @Test
    void getApplication_NotOwner_ThrowsException() {
        User wrongFreelancer = User.builder().id(UUID.randomUUID()).build();
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> freelancerWorkflowService.getApplication(mockApplication.getId(), wrongFreelancer))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_FORBIDDEN)
                .hasMessage("You are not authorized to view this application.");
    }

    @Test
    void deleteApplication_Success() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        freelancerWorkflowService.deleteApplication(mockApplication.getId(), mockFreelancer);

        verify(applicationService).deleteApplication(mockApplication);
    }

    @Test
    void getAllFreelancerApplications_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Application> applicationPage = new PageImpl<>(List.of(mockApplication), pageable, 1);

        when(applicationService.getAllApplicationsByFreelancerId(mockFreelancer.getId(), pageable))
                .thenReturn(applicationPage);

        Page<ApplicationDto> results = freelancerWorkflowService.getAllFreelancerApplications(mockFreelancer, pageable);

        assertThat(results).hasSize(1);
        assertThat(results.getContent().get(0).getId()).isEqualTo(mockApplication.getId());
    }

    @Test
    void getAllFreelancerApplications_NoApplications_ReturnsEmptyList() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Application> emptyPage = Page.empty(pageable);
        when(applicationService.getAllApplicationsByFreelancerId(mockFreelancer.getId(), pageable))
                .thenReturn(emptyPage);

        Page<ApplicationDto> results = freelancerWorkflowService.getAllFreelancerApplications(mockFreelancer, pageable);

        assertThat(results).isEmpty();
    }

    @Test
    void getAllVisibleProjects_FiltersExpiredClosedProjects() {
        Project expiredProject = Project.builder()
                .id(UUID.randomUUID())
                .projectStatus(ProjectStatus.CLOSED)
                .visibilityExpirationDate(LocalDate.now().minusDays(1))
                .build();

        Project activeProject = Project.builder()
                .id(UUID.randomUUID())
                .projectStatus(ProjectStatus.OPEN)
                .visibilityExpirationDate(LocalDate.now().plusDays(7))
                .build();

        Project closedButVisibleProject = Project.builder()
                .id(UUID.randomUUID())
                .projectStatus(ProjectStatus.CLOSED)
                .visibilityExpirationDate(LocalDate.now().plusDays(2))
                .build();

        List<Project> mockProjects = List.of(activeProject, closedButVisibleProject);
        Page<Project> mockPage = new PageImpl<>(mockProjects);
        Pageable pageable = PageRequest.of(0, 10);
        ProjectFilterDto filters = new ProjectFilterDto();

        when(projectService.findAllWithFilters(any(Specification.class), eq(pageable))).thenReturn(mockPage);
        Page<ProjectPublicDto> results = freelancerWorkflowService.getAllVisibleProjects(pageable, filters);

        assertThat(results.getContent()).hasSize(2);
        assertThat(results.getContent().stream().map(ProjectPublicDto::getId))
                .containsExactlyInAnyOrder(activeProject.getId(), closedButVisibleProject.getId());
        verify(projectService).findAllWithFilters(any(Specification.class), eq(pageable));
    }

    @Test
    void getProject_Success() {
        when(projectService.getProjectById(mockProject.getId())).thenReturn(mockProject);

        ProjectPublicDto result = freelancerWorkflowService.getProject(mockProject.getId());

        assertThat(result).isNotNull();
    }

    @Test
    void getProject_PendingStatus_ThrowsException() {
        mockProject.setProjectStatus(ProjectStatus.PENDING);
        when(projectService.getProjectById(mockProject.getId())).thenReturn(mockProject);

        assertThatThrownBy(() -> freelancerWorkflowService.getProject(mockProject.getId()))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("Project is not yet approved.");
    }

    @Test
    void getProject_ExpiredVisibility_ThrowsException() {
        mockProject.setVisibilityExpirationDate(LocalDate.now().minusDays(1));
        when(projectService.getProjectById(mockProject.getId())).thenReturn(mockProject);

        assertThatThrownBy(() -> freelancerWorkflowService.getProject(mockProject.getId()))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("Project visibility has expired.");
    }
}
