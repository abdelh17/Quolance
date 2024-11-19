package com.quolance.quolance_api.services.entity_services;


import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;

import java.util.List;

public interface ProjectService {

    void saveProject(Project project);
    void deleteProject(Project project);
    Project getProjectById(Long projectId);
//    void updateProject(Project project);

    List<Project> getAllProjects();
    List<Project> getProjectsByStatuses(List<ProjectStatus> projectStatuses);
    List<Project> getProjectsByClientId(Long clientId);

    void updateProjectStatus(Project project, ProjectStatus newStatus);
    void updateSelectedFreelancer(Project project, User freelancer);
}
