package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ApplicationService;
import com.quolance.quolance_api.services.FreelancerService;
import com.quolance.quolance_api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerServiceImpl implements FreelancerService {
    private final UserService userService;
    private final ApplicationService applicationService;

    @Override
    public ApplicationDto submitApplication(ApplicationDto applicationDto) {
        User freelancer = userService.findById(applicationDto.getUserId()).orElseThrow();
        Application applicationToSave = ApplicationDto.toEntity(applicationDto);
        applicationToSave.setFreelancer(freelancer);
        ApplicationDto savedApplication = applicationService.createApplication(applicationToSave);
        return savedApplication;
    }

    @Override
    public List<ApplicationDto> getMyApplications(Long freelancerId) {
        List<ApplicationDto> applications = applicationService.getApplicationByFreelancerId(freelancerId);
        return applications;
    }
}
