package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findApplicationsByFreelancerId(Long freelancerId);
    List<Application> findApplicationsByProjectId(Long projectId);
    Application findApplicationByFreelancerIdAndProjectId(Long freelancerId, Long projectId);
}
