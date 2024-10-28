package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.entities.Application;


import java.util.List;

public interface ApplicationService {

    ApplicationDto createApplication(Application Application);

    List<ApplicationDto> getApplicationByFreelancerId(Long freelancerId); //TODO Applications with s not Application

    List<ApplicationDto> getApplicationsByProjectId(Long projectId);


}
