package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.dtos.project.ProjectCreateResponseDto;
import com.quolance.quolance_api.entities.Project;

public interface ProjectModerationService {
    ProjectCreateResponseDto moderateProject(Project project);
}