package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.dtos.RejectProjectRequestDto;

import java.util.List;

public interface AdminService {
    ProjectDto approveProject(Long projectId);

    ProjectDto rejectProject(RejectProjectRequestDto rejectProjectRequestDto);

    List<ProjectDto> getAllPendingProjects();
}
