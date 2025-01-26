package com.quolance.quolance_api.unit.services.business_workflow;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectCreateDto;
import com.quolance.quolance_api.dtos.project.ProjectDto;
import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Profile;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
import com.quolance.quolance_api.services.business_workflow.impl.ClientWorkflowServiceImpl;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.util.exceptions.ApiException;
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
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientWorkflowServiceUnitTest {

    @Mock
    private ProjectService projectService;

    @Mock
    private ApplicationService applicationService;

    @Mock
    private UserService userService;

    @InjectMocks
    private ClientWorkflowServiceImpl clientWorkflowService;

    @Captor
    private ArgumentCaptor<Project> projectCaptor;

    private User mockClient;
    private User mockFreelancer;
    private Project mockProject;
    private ProjectCreateDto mockProjectCreateDto;
    private ProjectUpdateDto mockProjectUpdateDto;
    private Application mockApplication;

    @BeforeEach
    void setUp() {
        mockClient = User.builder()
                .id(1L)
                .email("client@test.com")
                .build();

        mockFreelancer = User.builder()
                .id(2L)
                .role(Role.FREELANCER)
                .firstName("John")
                .lastName("Doe")
                .email("freelancer@test.com")
                .profile(new Profile())
                .build();

        mockProject = Project.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .client(mockClient)
                .projectStatus(ProjectStatus.PENDING)
                .category(ProjectCategory.WEB_DEVELOPMENT)
                .priceRange(PriceRange.LESS_500)
                .experienceLevel(FreelancerExperienceLevel.INTERMEDIATE)
                .expectedDeliveryTime(ExpectedDeliveryTime.IMMEDIATELY)
                .expirationDate(LocalDate.now().plusDays(7))
                .build();

        mockProjectCreateDto = ProjectCreateDto.builder()
                .title("New Project")
                .description("New Description")
                .category(ProjectCategory.WEB_DEVELOPMENT)
                .priceRange(PriceRange.BETWEEN_5000_10000)
                .experienceLevel(FreelancerExperienceLevel.EXPERT)
                .expectedDeliveryTime(ExpectedDeliveryTime.WITHIN_A_WEEK)
                .expirationDate(LocalDate.now().plusDays(14))
                .tags(List.of(Tag.JAVA, Tag.JAVASCRIPT))
                .build();

        mockProjectUpdateDto = ProjectUpdateDto.builder()
                .title("Updated Title")
                .description("Updated Description")
                .category(ProjectCategory.WEB_DEVELOPMENT)
                .priceRange(PriceRange.BETWEEN_500_1000)
                .experienceLevel(FreelancerExperienceLevel.INTERMEDIATE)
                .expectedDeliveryTime(ExpectedDeliveryTime.WITHIN_A_WEEK)
                .build();

        mockApplication = Application.builder()
                .id(1L)
                .project(mockProject)
                .freelancer(mockFreelancer)
                .build();
    }

    @Test
    void createProject_WithExpirationDate_Success() {
        clientWorkflowService.createProject(mockProjectCreateDto, mockClient);

        verify(projectService).saveProject(projectCaptor.capture());
        Project savedProject = projectCaptor.getValue();

        assertThat(savedProject.getTitle()).isEqualTo(mockProjectCreateDto.getTitle());
        assertThat(savedProject.getDescription()).isEqualTo(mockProjectCreateDto.getDescription());
        assertThat(savedProject.getCategory()).isEqualTo(mockProjectCreateDto.getCategory());
        assertThat(savedProject.getPriceRange()).isEqualTo(mockProjectCreateDto.getPriceRange());
        assertThat(savedProject.getExperienceLevel()).isEqualTo(mockProjectCreateDto.getExperienceLevel());
        assertThat(savedProject.getExpectedDeliveryTime()).isEqualTo(mockProjectCreateDto.getExpectedDeliveryTime());
        assertThat(savedProject.getExpirationDate()).isEqualTo(mockProjectCreateDto.getExpirationDate());
        assertThat(savedProject.getTags()).isEqualTo(mockProjectCreateDto.getTags());
        assertThat(savedProject.getClient()).isEqualTo(mockClient);
    }

    @Test
    void createProject_WithoutExpirationDate_SetsDefaultDate() {
        mockProjectCreateDto.setExpirationDate(null);

        clientWorkflowService.createProject(mockProjectCreateDto, mockClient);

        verify(projectService).saveProject(projectCaptor.capture());
        Project savedProject = projectCaptor.getValue();

        assertThat(savedProject.getExpirationDate()).isEqualTo(LocalDate.now().plusDays(7));
    }

    @Test
    void createProject_WhenProjectCreationFails_ThrowsException() {
        doThrow(new ApiException("Project creation failed"))
                .when(projectService).saveProject(any(Project.class));

        assertThatThrownBy(() -> clientWorkflowService.createProject(mockProjectCreateDto, mockClient))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project creation failed");

        verify(projectService).saveProject(any(Project.class));
    }


    @Test
    void getProject_Success() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject);

        ProjectDto result = clientWorkflowService.getProject(1L, mockClient);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(mockProject.getId());
        assertThat(result.getTitle()).isEqualTo(mockProject.getTitle());
        verify(projectService).getProjectById(1L);
    }

    @Test
    void deleteProject_WhenOwner_Success() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject);

        clientWorkflowService.deleteProject(1L, mockClient);

        verify(projectService).deleteProject(mockProject);
    }

    @Test
    void deleteProject_WhenNotOwner_ThrowsApiException() {
        User wrongClient = User.builder().id(999L).build();
        when(projectService.getProjectById(1L)).thenReturn(mockProject);

        assertThatThrownBy(() -> clientWorkflowService.deleteProject(1L, wrongClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_FORBIDDEN)
                .hasMessage("You are not authorized to remove this project");
    }

    @Test
    void deleteProject_WhenProjectDeletionFails_ThrowsException() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject);
        doThrow(new ApiException("Project deletion failed"))
                .when(projectService).deleteProject(mockProject);

        assertThatThrownBy(() -> clientWorkflowService.deleteProject(1L, mockClient))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project deletion failed");

        verify(projectService).getProjectById(1L);
        verify(projectService).deleteProject(mockProject);
    }

    @Test
    void getAllClientProjects_Success() {
        Page<Project> projectPage = new PageImpl<>(List.of(mockProject));
        when(projectService.getProjectsByClientId(eq(mockClient.getId()), any(Pageable.class)))
                .thenReturn(projectPage);

        Page<ProjectDto> result = clientWorkflowService.getAllClientProjects(mockClient, Pageable.unpaged());

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getId()).isEqualTo(mockProject.getId());
        assertThat(result.getContent().get(0).getTitle()).isEqualTo(mockProject.getTitle());
        verify(projectService).getProjectsByClientId(eq(mockClient.getId()), any(Pageable.class));
    }

    @Test
    void getAllClientProjects_WhenNoProjects_ReturnsEmptyList() {
        Page<Project> emptyPage = Page.empty();
        when(projectService.getProjectsByClientId(eq(mockClient.getId()), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<ProjectDto> result = clientWorkflowService.getAllClientProjects(mockClient, Pageable.unpaged());

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
        verify(projectService).getProjectsByClientId(eq(mockClient.getId()), any(Pageable.class));
    }

    @Test
    void getAllApplicationsToProject_WhenOwner_Success() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject);
        when(applicationService.getAllApplicationsByProjectId(1L))
                .thenReturn(Arrays.asList(mockApplication));

        List<ApplicationDto> result = clientWorkflowService.getAllApplicationsToProject(1L, mockClient);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(mockApplication.getId());
    }

    @Test
    void getAllApplicationsToProject_WhenNotOwner_ThrowsApiException() {
        User wrongClient = User.builder().id(999L).build();
        when(projectService.getProjectById(1L)).thenReturn(mockProject);

        assertThatThrownBy(() -> clientWorkflowService.getAllApplicationsToProject(1L, wrongClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_FORBIDDEN)
                .hasMessage("You are not authorized to view this project applications");
    }

    @Test
    void updateProject_WhenOwner_Success() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject);

        ProjectDto result = clientWorkflowService.updateProject(1L, mockProjectUpdateDto, mockClient);

        assertThat(result).isNotNull();
        verify(projectService).updateProject(mockProject, mockProjectUpdateDto);
        assertThat(result.getTitle()).isEqualTo(mockProject.getTitle());
    }

    @Test
    void updateProject_WhenNotOwner_ThrowsApiException() {
        User wrongClient = User.builder().id(999L).build();
        when(projectService.getProjectById(1L)).thenReturn(mockProject);

        assertThatThrownBy(() -> clientWorkflowService.updateProject(1L, mockProjectUpdateDto, wrongClient))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", HttpServletResponse.SC_FORBIDDEN)
                .hasMessage("You don't have permission to update this project");
    }

    @Test
    void updateProject_WhenProjectUpdateFails_ThrowsException() {
        when(projectService.getProjectById(1L)).thenReturn(mockProject);
        doThrow(new ApiException("Project update failed"))
                .when(projectService).updateProject(any(Project.class), any(ProjectUpdateDto.class));

        assertThatThrownBy(() -> clientWorkflowService.updateProject(1L, mockProjectUpdateDto, mockClient))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project update failed");

        verify(projectService).getProjectById(1L);
        verify(projectService).updateProject(any(Project.class), any(ProjectUpdateDto.class));
    }

    @Test
    void getAllAvailableFreelancers_WithSearchNameFilter_ReturnsFilteredFreelancers() {

        List<User> mockFreelancers = List.of(mockFreelancer);
        Page<User> mockPage = new PageImpl<>(mockFreelancers);
        Pageable pageable = PageRequest.of(0, 10);
        FreelancerProfileFilterDto filters = new FreelancerProfileFilterDto();
        filters.setSearchName("John");

        when(userService.findAllWithFilters(any(Specification.class), eq(pageable))).thenReturn(mockPage);
        Page<FreelancerProfileDto> results = clientWorkflowService.getAllAvailableFreelancers(pageable, filters);

        assertThat(results.getContent()).hasSize(1);
        assertThat(results.getContent().stream().map(FreelancerProfileDto::getFirstName)).containsExactly("John");
        assertThat(results.getContent().stream().map(FreelancerProfileDto::getLastName)).containsExactly("Doe");
        verify(userService).findAllWithFilters(any(Specification.class), eq(pageable));
    }

    @Test
    void getAllAvailableFreelancers_WithExperienceLevelFilter_ReturnsFilteredFreelancers() {
        FreelancerProfileFilterDto filterDto = new FreelancerProfileFilterDto();
        filterDto.setExperienceLevel(FreelancerExperienceLevel.EXPERT);

        mockFreelancer.getProfile().setExperienceLevel(FreelancerExperienceLevel.EXPERT);
        Page<User> userPage = new PageImpl<>(List.of(mockFreelancer));
        when(userService.findAllWithFilters(any(Specification.class), any(Pageable.class)))
                .thenReturn(userPage);

        Page<FreelancerProfileDto> result = clientWorkflowService.getAllAvailableFreelancers(Pageable.unpaged(), filterDto);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getExperienceLevel()).isEqualTo(FreelancerExperienceLevel.EXPERT);
        verify(userService).findAllWithFilters(any(Specification.class), any(Pageable.class));
    }

    @Test
    void getAllAvailableFreelancers_WithAvailabilityFilter_ReturnsFilteredFreelancers() {
        FreelancerProfileFilterDto filterDto = new FreelancerProfileFilterDto();
        filterDto.setAvailability(Availability.FULL_TIME);

        mockFreelancer.getProfile().setAvailability(Availability.FULL_TIME);
        Page<User> userPage = new PageImpl<>(List.of(mockFreelancer));
        when(userService.findAllWithFilters(any(Specification.class), any(Pageable.class)))
                .thenReturn(userPage);

        Page<FreelancerProfileDto> result = clientWorkflowService.getAllAvailableFreelancers(Pageable.unpaged(), filterDto);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getAvailability()).isEqualTo(Availability.FULL_TIME);
        verify(userService).findAllWithFilters(any(Specification.class), any(Pageable.class));
    }

    @Test
    void getAllAvailableFreelancers_WithSkillsFilter_ReturnsFilteredFreelancers() {
        FreelancerProfileFilterDto filterDto = new FreelancerProfileFilterDto();
        filterDto.setSkills(Set.of(Tag.JAVA, Tag.JAVASCRIPT));

        mockFreelancer.getProfile().setSkills(Set.of(Tag.JAVA, Tag.JAVASCRIPT));
        Page<User> userPage = new PageImpl<>(List.of(mockFreelancer));
        when(userService.findAllWithFilters(any(Specification.class), any(Pageable.class)))
                .thenReturn(userPage);

        Page<FreelancerProfileDto> result = clientWorkflowService.getAllAvailableFreelancers(Pageable.unpaged(), filterDto);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSkills()).containsExactlyInAnyOrder(Tag.JAVA, Tag.JAVASCRIPT);
        verify(userService).findAllWithFilters(any(Specification.class), any(Pageable.class));
    }


}