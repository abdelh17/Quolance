package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.dtos.project.ProjectDto;


import java.util.List;

public interface AdminWorkflowService {
    List<ProjectDto> getAllPendingProjects();

    void approveProject(Long projectId);

    void rejectProject(Long projectId);
}
