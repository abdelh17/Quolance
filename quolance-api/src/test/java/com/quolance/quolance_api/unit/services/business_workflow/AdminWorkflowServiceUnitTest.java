package com.quolance.quolance_api.unit.services.business_workflow;

import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectCategory;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.impl.AdminWorkflowServiceImpl;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminWorkflowServiceUnitTest {

    @Mock
    private ProjectService projectService;

    // NEW: Inject NotificationMessageService as a mock
    @Mock
    private NotificationMessageService notificationMessageService;

    @InjectMocks
    private AdminWorkflowServiceImpl adminWorkflowService;

    private Project mockProject1;
    private Project mockProject2;
    private User mockClient;

    @BeforeEach
    void setUp() {
        mockClient = User.builder()
                .id(UUID.randomUUID())
                .email("client@test.com")
                .build();

        mockProject1 = Project.builder()
                .id(UUID.randomUUID())
                .title("Test Project 1")
                .description("Test Description 1")
                .projectStatus(ProjectStatus.PENDING)
                .category(ProjectCategory.WEB_DEVELOPMENT)
                .expirationDate(LocalDate.now().plusDays(30))
                .client(mockClient)
                .build();

        mockProject2 = Project.builder()
                .id(UUID.randomUUID())
                .title("Test Project 2")
                .description("Test Description 2")
                .projectStatus(ProjectStatus.PENDING)
                .category(ProjectCategory.WEB_DEVELOPMENT)
                .expirationDate(LocalDate.now().plusDays(30))
                .client(mockClient)
                .build();
    }

    @Test
    void getAllPendingProjects_ReturnsPageOfProjects() {
        List<Project> mockProjects = Arrays.asList(mockProject1, mockProject2);
        Page<Project> mockProjectPage = new PageImpl<>(mockProjects);

        when(projectService.getProjectsByStatuses(eq(Collections.singletonList(ProjectStatus.PENDING)), any(Pageable.class)))
                .thenReturn(mockProjectPage);

        Page<ProjectDto> result = adminWorkflowService.getAllPendingProjects(Pageable.unpaged());

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).getId()).isEqualTo(mockProject1.getId());
        assertThat(result.getContent().get(0).getTitle()).isEqualTo(mockProject1.getTitle());
        assertThat(result.getContent().get(1).getId()).isEqualTo(mockProject2.getId());
        assertThat(result.getContent().get(1).getTitle()).isEqualTo(mockProject2.getTitle());
        verify(projectService).getProjectsByStatuses(eq(Collections.singletonList(ProjectStatus.PENDING)), any(Pageable.class));
    }

    @Test
    void getAllPendingProjects_WhenNoProjects_ReturnsEmptyPage() {
        Page<Project> emptyPage = Page.empty();
        when(projectService.getProjectsByStatuses(eq(Collections.singletonList(ProjectStatus.PENDING)), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<ProjectDto> result = adminWorkflowService.getAllPendingProjects(Pageable.unpaged());

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
        verify(projectService).getProjectsByStatuses(eq(Collections.singletonList(ProjectStatus.PENDING)), any(Pageable.class));
    }

    @Test
    void approveProject_Success() {
        when(projectService.getProjectById(mockProject1.getId())).thenReturn(mockProject1);
        doNothing().when(projectService).updateProjectStatus(any(Project.class), eq(ProjectStatus.OPEN));

        adminWorkflowService.approveProject(mockProject1.getId());

        verify(projectService).getProjectById(mockProject1.getId());
        verify(projectService).updateProjectStatus(mockProject1, ProjectStatus.OPEN);
    }

    @Test
    void approveProject_WithInvalidId_ThrowsApiException() {
        UUID invalidId = UUID.randomUUID();
        when(projectService.getProjectById(invalidId))
                .thenThrow(new ApiException("Project not found"));

        assertThatThrownBy(() -> adminWorkflowService.approveProject(invalidId))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(projectService).getProjectById(invalidId);
        verify(projectService, never()).updateProjectStatus(any(), any());
    }

    @Test
    void rejectProject_Success() {
        when(projectService.getProjectById(mockProject1.getId())).thenReturn(mockProject1);
        doNothing().when(projectService).updateProjectStatus(any(Project.class), eq(ProjectStatus.REJECTED));

        adminWorkflowService.rejectProject(mockProject1.getId(), "Test Reason");
        verify(projectService).updateProjectStatus(mockProject1, ProjectStatus.REJECTED);
    }

    @Test
    void rejectProject_WithInvalidId_ThrowsApiException() {
        UUID invalidId = UUID.randomUUID();
        when(projectService.getProjectById(invalidId))
                .thenThrow(new ApiException("Project not found"));

        assertThatThrownBy(() -> adminWorkflowService.rejectProject(invalidId, "Test Reason"))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(projectService).getProjectById(invalidId);
        verify(projectService, never()).updateProjectStatus(any(), any());
    }
}