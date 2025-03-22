package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Page<Application> findApplicationsByFreelancerId(UUID freelancerId, Pageable pageable);

    List<Application> findApplicationsByProjectId(UUID projectId);

    Application findApplicationByFreelancerIdAndProjectId(UUID freelancerId, UUID projectId);

    List<Application> findApplicationsByFreelancerId(UUID freelancerId);

}
