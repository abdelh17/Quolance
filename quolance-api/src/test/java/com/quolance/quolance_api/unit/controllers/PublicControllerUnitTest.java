package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.PublicController;
import com.quolance.quolance_api.dtos.paging.PageResponseDto;
import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.project.ProjectFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
import com.quolance.quolance_api.util.PaginationUtils;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PublicControllerUnitTest {

    @Mock
    private FreelancerWorkflowService freelancerWorkflowService;

    @Mock
    private PaginationUtils paginationUtils;

    @InjectMocks
    private PublicController publicController;

    private ProjectPublicDto sampleProject;
    private List<ProjectPublicDto> sampleProjects;

    @BeforeEach
    void setUp() {
        sampleProject = ProjectPublicDto.builder()
                .id(1L)
                .title("Sample Project")
                .description("Sample Description")
                .build();

        sampleProjects = Arrays.asList(
                sampleProject,
                ProjectPublicDto.builder()
                        .id(2L)
                        .title("Another Project")
                        .description("Another Description")
                        .build()
        );
    }

    @Test
    void getAllAvailableProjects_ShouldReturnProjects_WhenProjectsExist() {
        PageableRequestDto pageableRequestDto = new PageableRequestDto();
        pageableRequestDto.setPage(0);
        pageableRequestDto.setSize(10);
        Page<ProjectPublicDto> projectPage = new PageImpl<>(sampleProjects);
        when(freelancerWorkflowService.getAllAvailableProjects(any(Pageable.class), any(ProjectFilterDto.class)))
                .thenReturn(projectPage);

        ResponseEntity<PageResponseDto<ProjectPublicDto>> response = publicController.getAllAvailableProjects(pageableRequestDto, new ProjectFilterDto());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getContent())
                .isNotNull()
                .hasSize(2)
                .isEqualTo(sampleProjects);
        verify(freelancerWorkflowService).getAllAvailableProjects(any(Pageable.class), any(ProjectFilterDto.class));
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getAllAvailableProjects_ShouldReturnEmptyList_WhenNoProjects() {
        PageableRequestDto pageableRequestDto = new PageableRequestDto();
        pageableRequestDto.setPage(0);
        pageableRequestDto.setSize(10);
        Page<ProjectPublicDto> emptyPage = new PageImpl<>(Collections.emptyList());
        when(freelancerWorkflowService.getAllAvailableProjects(any(Pageable.class), any(ProjectFilterDto.class)))
                .thenReturn(emptyPage);

        ResponseEntity<PageResponseDto<ProjectPublicDto>> response = publicController.getAllAvailableProjects(pageableRequestDto, new ProjectFilterDto());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getContent())
                .isNotNull()
                .isEmpty();
        verify(freelancerWorkflowService).getAllAvailableProjects(any(Pageable.class), any(ProjectFilterDto.class));
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getAllAvailableProjects_ShouldThrowApiException_WhenServiceFails() {
        PageableRequestDto pageableRequestDto = new PageableRequestDto();
        pageableRequestDto.setPage(0);
        pageableRequestDto.setSize(10);
        when(freelancerWorkflowService.getAllAvailableProjects(any(Pageable.class), any(ProjectFilterDto.class)))
                .thenThrow(ApiException.builder()
                        .message("Failed to fetch projects")
                        .status(500)
                        .build());

        assertThatThrownBy(() -> publicController.getAllAvailableProjects(pageableRequestDto, new ProjectFilterDto()))
                .isInstanceOf(ApiException.class)
                .hasMessage("Failed to fetch projects");
        verify(freelancerWorkflowService).getAllAvailableProjects(any(Pageable.class), any(ProjectFilterDto.class));
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getProjectById_ShouldReturnProject_WhenProjectExists() {
        when(freelancerWorkflowService.getProject(1L)).thenReturn(sampleProject);

        ResponseEntity<ProjectPublicDto> response = publicController.getProjectById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .isEqualTo(sampleProject);
        verify(freelancerWorkflowService).getProject(1L);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getProjectById_ShouldThrowApiException_WhenProjectNotFound() {
        when(freelancerWorkflowService.getProject(anyLong()))
                .thenThrow(ApiException.builder()
                        .message("Project not found")
                        .status(404)
                        .build());

        assertThatThrownBy(() -> publicController.getProjectById(999L))
                .isInstanceOf(ApiException.class)
                .hasMessage("Project not found");
        verify(freelancerWorkflowService).getProject(999L);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getProjectById_ShouldThrowApiException_WhenServiceFails() {
        when(freelancerWorkflowService.getProject(anyLong()))
                .thenThrow(ApiException.builder()
                        .message("Service unavailable")
                        .status(500)
                        .build());

        assertThatThrownBy(() -> publicController.getProjectById(1L))
                .isInstanceOf(ApiException.class)
                .hasMessage("Service unavailable");
        verify(freelancerWorkflowService).getProject(1L);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getFreelancerProfile_ShouldReturnProfile_WhenUsernameIsValid() {
        String validUsername = "validUser";
        FreelancerProfileDto profile = FreelancerProfileDto.builder()
                .username(validUsername)
                .firstName("John")
                .lastName("Doe")
                .build();
        when(freelancerWorkflowService.getFreelancerProfile(validUsername)).thenReturn(profile);

        ResponseEntity<FreelancerProfileDto> response = publicController.getFreelancerProfile(validUsername);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .isEqualTo(profile);
        verify(freelancerWorkflowService).getFreelancerProfile(validUsername);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

    @Test
    void getFreelancerProfile_ShouldThrowApiException_WhenUsernameIsInvalid() {
        String invalidUsername = "invalidUser";
        when(freelancerWorkflowService.getFreelancerProfile(invalidUsername))
                .thenThrow(ApiException.builder()
                        .message("Freelancer profile not found")
                        .status(404)
                        .build());

        assertThatThrownBy(() -> publicController.getFreelancerProfile(invalidUsername))
                .isInstanceOf(ApiException.class)
                .hasMessage("Freelancer profile not found");
        verify(freelancerWorkflowService).getFreelancerProfile(invalidUsername);
        verifyNoMoreInteractions(freelancerWorkflowService);
    }

}