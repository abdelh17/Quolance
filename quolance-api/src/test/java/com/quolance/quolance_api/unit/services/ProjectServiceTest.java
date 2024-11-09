package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.enums.Tag;
import com.quolance.quolance_api.repositories.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Project testProject;
    private User testClient;
    private ProjectDto testProjectDto;
    private List<Application> testApplications;
    private List<Tag> testTags;

    @BeforeEach
    void setUp() {
        // Setup test client
        testClient = User.builder()
                .id(1L)
                .email("client@test.com")
                .firstName("Test")
                .lastName("Client")
                .build();

        // Setup test tags with actual enum values
        testTags = Arrays.asList(Tag.JAVA, Tag.JAVASCRIPT);

        // Setup test project
        testProject = Project.builder()
                .id(1L)
                .description("Test Project")
                .client(testClient)
                .tags(testTags)
                .build();

        // Setup test project DTO
        testProjectDto = ProjectDto.builder()
                .id(1L)
                .description("Test Project")
                .clientId(1L)
                .tags(testTags)
                .build();

        // Setup test applications
        testApplications = List.of(
                Application.builder()
                        .id(1L)
                        .project(testProject)
                        .build()
        );
        testProject.setApplications(testApplications);
    }

    @Nested
    @DisplayName("Create Project Tests")
    class CreateProjectTests {
        @Test
        @DisplayName("Should create project successfully")
        void createProject_Success() {
            // Arrange
            when(projectRepository.save(any(Project.class))).thenReturn(testProject);

            // Act
            ProjectDto result = projectService.createProject(testProject);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(testProject.getId());
            assertThat(result.getDescription()).isEqualTo(testProject.getDescription());
            assertThat(result.getClientId()).isEqualTo(testProject.getClient().getId());
            assertThat(result.getTags()).containsExactlyInAnyOrderElementsOf(testTags);
            verify(projectRepository).save(any(Project.class));
        }

    }

    @Nested
    @DisplayName("Get Projects Tests")
    class GetProjectsTests {
        @Test
        @DisplayName("Should return projects for client id")
        void getProjectsByClientId_Success() {
            // Arrange
            when(projectRepository.findAllByClientId(testClient.getId()))
                    .thenReturn(List.of(testProject));

            // Act
            List<ProjectDto> results = projectService.getProjectsByClientId(testClient.getId());

            // Assert
            assertThat(results).isNotEmpty()
                    .hasSize(1)
                    .first()
                    .satisfies(dto -> {
                        assertThat(dto.getId()).isEqualTo(testProject.getId());
                        assertThat(dto.getDescription()).isEqualTo(testProject.getDescription());
                        assertThat(dto.getClientId()).isEqualTo(testProject.getClient().getId());
                        assertThat(dto.getTags()).containsExactlyInAnyOrderElementsOf(testTags);
                    });
        }

        @Test
        @DisplayName("Should return empty list when no projects found for client")
        void getProjectsByClientId_WhenNoProjects_ReturnsEmptyList() {
            // Arrange
            when(projectRepository.findAllByClientId(testClient.getId()))
                    .thenReturn(List.of());

            // Act
            List<ProjectDto> results = projectService.getProjectsByClientId(testClient.getId());

            // Assert
            assertThat(results).isEmpty();
        }

        @Test
        @DisplayName("Should return project by id when exists")
        void getProjectById_WhenExists_ReturnsProject() {
            // Arrange
            when(projectRepository.findById(testProject.getId()))
                    .thenReturn(Optional.of(testProject));

            // Act
            ProjectDto result = projectService.getProjectById(testProject.getId());

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(testProject.getId());
            assertThat(result.getDescription()).isEqualTo(testProject.getDescription());
            assertThat(result.getClientId()).isEqualTo(testProject.getClient().getId());
            assertThat(result.getTags()).containsExactlyInAnyOrderElementsOf(testTags);
        }

        @Test
        @DisplayName("Should return all projects")
        void getAllProjects_Success() {
            // Arrange
            when(projectRepository.findAll()).thenReturn(List.of(testProject));

            // Act
            List<ProjectDto> results = projectService.getAllProjects();

            // Assert
            assertThat(results).isNotEmpty()
                    .hasSize(1)
                    .first()
                    .satisfies(dto -> {
                        assertThat(dto.getId()).isEqualTo(testProject.getId());
                        assertThat(dto.getDescription()).isEqualTo(testProject.getDescription());
                        assertThat(dto.getClientId()).isEqualTo(testProject.getClient().getId());
                        assertThat(dto.getTags()).containsExactlyInAnyOrderElementsOf(testTags);
                    });
        }
    }
}