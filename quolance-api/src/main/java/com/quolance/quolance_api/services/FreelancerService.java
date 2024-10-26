package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.ApplicationDto;
import java.util.List;

public interface FreelancerService {

    ApplicationDto submitApplication(ApplicationDto applicationDto);
    List<ApplicationDto> getMyApplications(Long freelancerId);
}
