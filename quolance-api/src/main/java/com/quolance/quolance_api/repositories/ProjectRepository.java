package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project save(Project project);

    List<Project> findAllByClientId(Long clientId);
}
