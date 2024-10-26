package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;

    @Override
    public ProjectDto createProject(Project project) {
        Project savedProject = projectRepository.save(project);
        return ProjectDto.fromEntity(savedProject);
    }

    @Override
    public List<ProjectDto> getProjectsByClientId(Long clientId) {
        List<Project> projects = projectRepository.findAllByClientId(clientId);
        return projects.stream().map(ProjectDto::fromEntity).toList();

    }

    @Override
    public List<ProjectDto> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream().map(ProjectDto::fromEntity).toList();
    }

    @Override
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return ProjectDto.fromEntity(project);
    }
}
