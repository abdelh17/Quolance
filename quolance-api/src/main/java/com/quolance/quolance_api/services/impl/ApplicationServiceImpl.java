package com.quolance.quolance_api.services.impl;
import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.services.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;

    @Override
    public ApplicationDto createApplication(Application application) {
        Application savedApplication = applicationRepository.save(application);
        return ApplicationDto.fromEntity(savedApplication);
    }


    @Override
    public List<ApplicationDto> getApplicationByFreelancerId(Long freelancerId) {
        List<Application> applications = applicationRepository.findAllByFreelancerId(freelancerId);
        return applications.stream().map(ApplicationDto::fromEntity).toList();
    }
}
