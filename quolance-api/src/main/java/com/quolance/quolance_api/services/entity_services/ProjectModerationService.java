package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.project.ProjectEvaluationResult;
import com.quolance.quolance_api.entities.Project;

public interface ProjectModerationService {
    ProjectEvaluationResult evaluateProject(Project project);
}