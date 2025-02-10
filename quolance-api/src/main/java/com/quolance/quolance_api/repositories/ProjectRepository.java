package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID>, JpaSpecificationExecutor<Project> {
    Page<Project> findProjectsByClientId(UUID clientId, Pageable pageable);

    Page<Project> findProjectsByProjectStatusIn(List<ProjectStatus> projectStatuses, Pageable pageable);
}
