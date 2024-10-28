package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project save(Project project);

    List<Project> findAllByClientId(Long clientId);

    Optional<Project> findById(Long id);
}
