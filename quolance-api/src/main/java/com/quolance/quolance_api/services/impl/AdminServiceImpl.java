package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ProjectDto;
import com.quolance.quolance_api.services.AdminService;
import com.quolance.quolance_api.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final ProjectService projectService;
    @Override
    public ProjectDto approveProject(Long projectId) {
        return projectService.approveProject(projectId);
    }
}
