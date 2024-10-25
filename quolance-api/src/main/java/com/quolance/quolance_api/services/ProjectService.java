package com.quolance.quolance_api.services;


import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Project;

import java.util.List;

public interface ProjectService {
    ProjectDto createProject(Project project);

    List<ProjectDto> getProjectsByClientId(Long clientId);
}
