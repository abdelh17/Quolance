package com.quolance.quolance_api.services.entity_services;


import com.quolance.quolance_api.dtos.project.ProjectUpdateDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    void saveProject(Project project);

    void deleteProject(Project project);

    Project getProjectById(UUID projectId);

    void updateProject(Project existingProject, ProjectUpdateDto updatedProject);

    Page<Project> findAllWithFilters(Specification<Project> spec, Pageable pageable);

    Page<Project> getProjectsByStatuses(List<ProjectStatus> projectStatuses, Pageable pageable);

    Page<Project> getProjectsByClientId(UUID clientId, Pageable pageable);

    void updateProjectStatus(Project project, ProjectStatus newStatus);

    void updateSelectedFreelancer(Project project, User freelancer);

    void setProjectRejectionReason(Project project, String rejectionReason);
}
