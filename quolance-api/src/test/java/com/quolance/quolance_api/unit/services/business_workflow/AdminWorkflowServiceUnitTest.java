package com.quolance.quolance_api.unit.services.business_workflow;

import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectCategory;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.business_workflow.impl.AdminWorkflowServiceImpl;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminWorkflowServiceTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private AdminWorkflowServiceImpl adminWorkflowService;

    private Project mockProject1;
    private Project mockProject2;
    private User mockClient;

    @BeforeEach
    void setUp() {
        mockClient = User.builder()
                .id(1L)
                .email("client@test.com")
                .build();

        mockProject1 = Project.builder()
                .id(1L)
                .title("Test Project 1")
                .description("Test Description 1")
                .projectStatus(ProjectStatus.PENDING)
                .category(ProjectCategory.WEB_DEVELOPMENT)
                .expirationDate(LocalDate.now().plusDays(30))
                .client(mockClient)
                .build();

        mockProject2 = Project.builder()
                .id(2L)
                .title("Test Project 2")
                .description("Test Description 2")
                .projectStatus(ProjectStatus.PENDING)
                .category(ProjectCategory.WEB_DEVELOPMENT)
                .expirationDate(LocalDate.now().plusDays(30))
                .client(mockClient)
                .build();
    }

    @Test
    void getAllPendingProjects_ReturnsListOfProjects() {
        List<Project> mockProjects = Arrays.asList(mockProject1, mockProject2);
        when(projectService.getProjectsByStatuses(Collections.singletonList(ProjectStatus.PENDING)))
                .thenReturn(mockProjects);

        List<ProjectDto> result = adminWorkflowService.getAllPendingProjects();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(mockProject1.getId());
        assertThat(result.get(0).getTitle()).isEqualTo(mockProject1.getTitle());
        assertThat(result.get(1).getId()).isEqualTo(mockProject2.getId());
        assertThat(result.get(1).getTitle()).isEqualTo(mockProject2.getTitle());
        verify(projectService).getProjectsByStatuses(Collections.singletonList(ProjectStatus.PENDING));
    }

    @Test
    void getAllPendingProjects_WhenNoProjects_ReturnsEmptyList() {
        when(projectService.getProjectsByStatuses(Collections.singletonList(ProjectStatus.PENDING)))
                .thenReturn(Collections.emptyList());

        List<ProjectDto> result = adminWorkflowService.getAllPendingProjects();

        assertThat(result).isEmpty();
        verify(projectService).getProjectsByStatuses(Collections.singletonList(ProjectStatus.PENDING));
    }

    @Test
    void approveProject_Success() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject1);
        doNothing().when(projectService).updateProjectStatus(any(Project.class), eq(ProjectStatus.OPEN));

        adminWorkflowService.approveProject(1L);

        verify(projectService).getProjectById(1L);
        verify(projectService).updateProjectStatus(mockProject1, ProjectStatus.OPEN);
    }

    @Test
    void approveProject_WithInvalidId_ThrowsApiException() {
        when(projectService.getProjectById(999L))
                .thenThrow(new ApiException("Project not found"));

        assertThatThrownBy(() -> adminWorkflowService.approveProject(999L))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(projectService).getProjectById(999L);
        verify(projectService, never()).updateProjectStatus(any(), any());
    }

    @Test
    void rejectProject_Success() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject1);
        doNothing().when(projectService).updateProjectStatus(any(Project.class), eq(ProjectStatus.REJECTED));

        adminWorkflowService.rejectProject(1L);

        verify(projectService).getProjectById(1L);
        verify(projectService).updateProjectStatus(mockProject1, ProjectStatus.REJECTED);
    }

    @Test
    void rejectProject_WithInvalidId_ThrowsApiException() {
        when(projectService.getProjectById(999L))
                .thenThrow(new ApiException("Project not found"));

        assertThatThrownBy(() -> adminWorkflowService.rejectProject(999L))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(projectService).getProjectById(999L);
        verify(projectService, never()).updateProjectStatus(any(), any());
    }
}