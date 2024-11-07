package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.dtos.RejectProjectRequestDto;
import com.quolance.quolance_api.services.AdminService;
import com.quolance.quolance_api.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final ProjectService projectService;

    @Override
    public ProjectDto approveProject(Long projectId) {
        return projectService.approveProject(projectId);
    }

    @Override
    public ProjectDto rejectProject(RejectProjectRequestDto rejectProjectRequestDto) {
        return projectService.rejectProject(rejectProjectRequestDto);
    }

    @Override
    public List<ProjectDto> getAllPendingProjects() {
        return projectService.getAllPendingProjects();
    }
}
