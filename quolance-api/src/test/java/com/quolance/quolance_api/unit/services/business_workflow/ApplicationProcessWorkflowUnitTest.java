package com.quolance.quolance_api.unit.services.business_workflow;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.impl.ApplicationProcessWorkflowImpl;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationProcessWorkflowUnitTest {

    @Mock
    private ApplicationService applicationService;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ApplicationProcessWorkflowImpl applicationProcessWorkflow;

    private User mockClient;
    private User mockFreelancer;
    private Project mockProject;
    private Application mockApplication;
    private Application mockApplication2;

    @BeforeEach
    void setUp() {
        mockClient = User.builder()
                .id(UUID.randomUUID())
                .email("client@test.com")
                .build();

        mockFreelancer = User.builder()
                .id(UUID.randomUUID())
                .email("freelancer@test.com")
                .build();

        mockProject = Project.builder()
                .id(UUID.randomUUID())
                .client(mockClient)
                .projectStatus(ProjectStatus.OPEN)
                .build();

        mockApplication = Application.builder()
                .id(UUID.randomUUID())
                .project(mockProject)
                .freelancer(mockFreelancer)
                .applicationStatus(ApplicationStatus.APPLIED)
                .build();

        mockApplication2 = Application.builder()
                .id(UUID.randomUUID())
                .project(mockProject)
                .freelancer(User.builder().id(mockFreelancer.getId()).build())
                .applicationStatus(ApplicationStatus.APPLIED)
                .build();
    }

    @Test
    void selectFreelancer_Success() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);
        when(applicationService.getAllApplicationsByProjectId(mockProject.getId()))
                .thenReturn(Arrays.asList(mockApplication, mockApplication2));

        applicationProcessWorkflow.selectFreelancer(mockApplication.getId(), mockClient);

        verify(applicationService).updateApplicationStatus(mockApplication, ApplicationStatus.ACCEPTED);
        verify(projectService).updateProjectStatus(mockProject, ProjectStatus.CLOSED);
        verify(projectService).updateSelectedFreelancer(mockProject, mockFreelancer);
        verify(applicationService).updateApplicationStatus(mockApplication2, ApplicationStatus.REJECTED);
    }

    @Test
    void selectFreelancer_WhenNotProjectOwner_ThrowsApiException() {
        User wrongClient = User.builder().id(UUID.randomUUID()).build();
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> applicationProcessWorkflow.selectFreelancer(mockApplication.getId(), wrongClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_FORBIDDEN)
                .hasMessage("You are not authorized to perform this action on this project");
    }

    @Test
    void selectFreelancer_WhenProjectNotOpen_ThrowsApiException() {
        mockProject.setProjectStatus(ProjectStatus.PENDING);
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> applicationProcessWorkflow.selectFreelancer(mockApplication.getId(), mockClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("Cannot perform this action, project is either pending or rejected");
    }

    @Test
    void selectFreelancer_WhenFreelancerAlreadySelected_ThrowsApiException() {
        mockProject.setSelectedFreelancer(mockFreelancer);
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> applicationProcessWorkflow.selectFreelancer(mockApplication.getId(), mockClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("A freelancer is already working on this project");
    }

    @Test
    void selectFreelancer_WhenOptimisticLockException_ThrowsApiException() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);
        doThrow(new OptimisticLockException("Resource was updated")).when(applicationService)
                .updateApplicationStatus(any(), any());

        assertThatThrownBy(() -> applicationProcessWorkflow.selectFreelancer(mockApplication.getId(), mockClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("The resource was modified by another user. Please refresh the page and try again.");
    }

    @Test
    void rejectApplication_Success() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        applicationProcessWorkflow.rejectApplication(mockApplication.getId(), mockClient);

        verify(applicationService).updateApplicationStatus(mockApplication, ApplicationStatus.REJECTED);
    }

    @Test
    void rejectManyApplications_AllSuccessful() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);
        when(applicationService.getApplicationById(mockApplication2.getId())).thenReturn(mockApplication2);

        List<UUID> applicationIds = Arrays.asList(mockApplication.getId(), mockApplication2.getId());
        assertThatThrownBy(() -> applicationProcessWorkflow.rejectManyApplications(applicationIds, mockClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_PARTIAL_CONTENT);

        verify(applicationService, times(1)).updateApplicationStatus(mockApplication, ApplicationStatus.REJECTED);
        verify(applicationService, times(1)).updateApplicationStatus(mockApplication2, ApplicationStatus.REJECTED);
    }

    @Test
    void cancelApplication_Success() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        applicationProcessWorkflow.cancelApplication(mockApplication.getId(), mockFreelancer);

        verify(applicationService).deleteApplication(mockApplication);
    }

    @Test
    void cancelApplication_WhenNotOwner_ThrowsApiException() {
        User wrongFreelancer = User.builder().id(UUID.randomUUID()).build();
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> applicationProcessWorkflow.cancelApplication(mockApplication.getId(), wrongFreelancer))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 403)
                .hasMessage("You are not authorized to perform this action on that application");
    }

    @Test
    void cancelApplication_WhenAlreadyAccepted_ThrowsApiException() {
        mockApplication.setApplicationStatus(ApplicationStatus.ACCEPTED);
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> applicationProcessWorkflow.cancelApplication(mockApplication.getId(), mockFreelancer))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("You cannot cancel an application that has been accepted");
    }

    @Test
    void cancelApplication_WhenOptimisticLockException_ThrowsApiException() {
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);
        doThrow(new OptimisticLockException("Resource was updated")).when(applicationService)
                .deleteApplication(any());

        assertThatThrownBy(() -> applicationProcessWorkflow.cancelApplication(mockApplication.getId(), mockFreelancer))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_CONFLICT)
                .hasMessage("The resource was modified by another user. Please refresh the page and try again.");
    }

    @Test
    void cancelApplication_WhenApplicationNotCancelable_ThrowsException() {
        mockApplication.setApplicationStatus(ApplicationStatus.ACCEPTED);
        when(applicationService.getApplicationById(mockApplication.getId())).thenReturn(mockApplication);

        assertThatThrownBy(() -> applicationProcessWorkflow.cancelApplication(mockApplication.getId(), mockFreelancer))
                .isInstanceOf(ApiException.class)
                .hasMessage("You cannot cancel an application that has been accepted");

        verify(applicationService).getApplicationById(mockApplication.getId());
        verify(applicationService, never()).deleteApplication(any());
    }
}