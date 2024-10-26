package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Application save(Application application);

    List<Application> findAllByFreelancerId(Long freelancerId);
}
