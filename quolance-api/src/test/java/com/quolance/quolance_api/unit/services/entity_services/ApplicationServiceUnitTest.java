package com.quolance.quolance_api.unit.services.entity_services;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.services.entity_services.impl.ApplicationServiceImpl;
import com.quolance.quolance_api.util.exceptions.ApiException;
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
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceUnitTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    @Captor
    private ArgumentCaptor<Application> applicationCaptor;

    private Application mockApplication;

    @BeforeEach
    void setUp() {
        mockApplication = Application.builder()
                .id(UUID.randomUUID())
                .project(Project.builder().id(UUID.randomUUID()).build())
                .freelancer(User.builder().id(UUID.randomUUID()).build())
                .applicationStatus(ApplicationStatus.APPLIED)
                .build();
    }

    @Test
    void saveApplication_Success() {
        when(applicationRepository.save(any(Application.class))).thenReturn(mockApplication);

        applicationService.saveApplication(mockApplication);

        verify(applicationRepository).save(mockApplication);
    }

    @Test
    void deleteApplication_Success() {
        applicationService.deleteApplication(mockApplication);

        verify(applicationRepository).delete(mockApplication);
    }

    @Test
    void getApplicationById_Success() {
        when(applicationRepository.findById(mockApplication.getId())).thenReturn(Optional.of(mockApplication));

        Application result = applicationService.getApplicationById(mockApplication.getId());

        assertThat(result).isEqualTo(mockApplication);
        verify(applicationRepository).findById(mockApplication.getId());
    }

    @Test
    void getApplicationById_NotFound_ThrowsException() {
        UUID id = UUID.randomUUID();
        when(applicationRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applicationService.getApplicationById(id))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 404)
                .hasMessage("No Application found with ID: " + id);
    }

    @Test
    void getAllApplications_Success() {
        List<Application> applications = Arrays.asList(mockApplication);
        when(applicationRepository.findAll()).thenReturn(applications);

        List<Application> result = applicationService.getAllApplications();

        assertThat(result)
                .hasSize(1)
                .containsExactly(mockApplication);
    }

    @Test
    void getApplicationByFreelancerIdAndProjectId_Success() {

        when(applicationRepository.findApplicationByFreelancerIdAndProjectId(mockApplication.getFreelancer().getId(), mockApplication.getProject().getId()))
                .thenReturn(mockApplication);

        Application result = applicationService.getApplicationByFreelancerIdAndProjectId(mockApplication.getFreelancer().getId(), mockApplication.getProject().getId());

        assertThat(result).isEqualTo(mockApplication);
    }

    @Test
    void getAllApplicationsByFreelancerId_Success() {
        List<Application> applications = List.of(mockApplication);
        Page<Application> expectedPage = new PageImpl<>(applications);

        when(applicationRepository.findApplicationsByFreelancerId(eq(mockApplication.getFreelancer().getId()), any(Pageable.class)))
                .thenReturn(expectedPage);

        Page<Application> result = applicationService.getAllApplicationsByFreelancerId(mockApplication.getFreelancer().getId(), Pageable.unpaged());

        assertThat(result.getContent())
                .hasSize(1)
                .containsExactly(mockApplication);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(applicationRepository).findApplicationsByFreelancerId(eq(mockApplication.getFreelancer().getId()), any(Pageable.class));
    }

    @Test
    void getAllApplicationsByFreelancerId_NoApplicationsFound_ReturnsEmptyPage() {
        Page<Application> emptyPage = Page.empty();
        UUID freelancerId = UUID.randomUUID();
        when(applicationRepository.findApplicationsByFreelancerId(eq(freelancerId), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<Application> result = applicationService.getAllApplicationsByFreelancerId(freelancerId, Pageable.unpaged());

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
        verify(applicationRepository).findApplicationsByFreelancerId(eq(freelancerId), any(Pageable.class));
    }

    @Test
    void getAllApplicationsByProjectId_Success() {
        List<Application> applications = Arrays.asList(mockApplication);
        when(applicationRepository.findApplicationsByProjectId(mockApplication.getProject().getId())).thenReturn(applications);

        List<Application> result = applicationService.getAllApplicationsByProjectId(mockApplication.getProject().getId());

        assertThat(result)
                .hasSize(1)
                .containsExactly(mockApplication);
    }

    @Test
    void getAllApplicationsByProjectId_NoApplicationsFound_ReturnsEmptyList() {
        UUID projectId = UUID.randomUUID();
        when(applicationRepository.findApplicationsByProjectId(projectId)).thenReturn(List.of());

        List<Application> result = applicationService.getAllApplicationsByProjectId(projectId);

        assertThat(result).isEmpty();
        verify(applicationRepository).findApplicationsByProjectId(projectId);
    }

    @Test
    void updateApplicationStatus_Success_ToAccepted() {
        when(applicationRepository.save(any(Application.class))).thenReturn(mockApplication);

        applicationService.updateApplicationStatus(mockApplication, ApplicationStatus.ACCEPTED);

        verify(applicationRepository).save(applicationCaptor.capture());
        Application savedApplication = applicationCaptor.getValue();
        assertThat(savedApplication.getApplicationStatus()).isEqualTo(ApplicationStatus.ACCEPTED);
    }

    @Test
    void updateApplicationStatus_Success_ToRejected() {
        when(applicationRepository.save(any(Application.class))).thenReturn(mockApplication);

        applicationService.updateApplicationStatus(mockApplication, ApplicationStatus.REJECTED);

        verify(applicationRepository).save(applicationCaptor.capture());
        Application savedApplication = applicationCaptor.getValue();
        assertThat(savedApplication.getApplicationStatus()).isEqualTo(ApplicationStatus.REJECTED);
    }

    @Test
    void updateApplicationStatus_SameStatus_ThrowsException() {
        mockApplication.setApplicationStatus(ApplicationStatus.ACCEPTED);

        assertThatThrownBy(() -> applicationService.updateApplicationStatus(mockApplication, ApplicationStatus.ACCEPTED))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 409)
                .hasMessage("Application is already in status: ACCEPTED");
    }

    @Test
    void updateApplicationStatus_FromRejected_ThrowsException() {
        mockApplication.setApplicationStatus(ApplicationStatus.REJECTED);

        assertThatThrownBy(() -> applicationService.updateApplicationStatus(mockApplication, ApplicationStatus.ACCEPTED))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 403)
                .hasMessage("Application is rejected and cannot be updated.");
    }

    @Test
    void updateApplicationStatus_FromAccepted_ThrowsException() {
        mockApplication.setApplicationStatus(ApplicationStatus.ACCEPTED);

        assertThatThrownBy(() -> applicationService.updateApplicationStatus(mockApplication, ApplicationStatus.REJECTED))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("status", 403)
                .hasMessage("Application is accepted and cannot be updated.");
    }
}