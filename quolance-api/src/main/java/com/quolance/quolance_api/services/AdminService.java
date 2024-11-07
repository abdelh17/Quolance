package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.ProjectDto;

public interface AdminService {
    ProjectDto approveProject(Long projectId);
}
