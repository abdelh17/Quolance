package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.ApplicationDto;
import com.quolance.quolance_api.services.FreelancerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freelancer")
@RequiredArgsConstructor
public class FreelancerController {
    private final FreelancerService freelancerService;

    @PostMapping("/submit-application")
    public ResponseEntity<ApplicationDto> createProject(@RequestBody ApplicationDto applicationDto) {
        ApplicationDto application = freelancerService.submitApplication(applicationDto);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/applications/freelancer/{id}")
    public ResponseEntity<List<ApplicationDto>> getAllMyApplications(@PathVariable(name = "id") Long freelancerId) {
        List<ApplicationDto> applications = freelancerService.getMyApplications(freelancerId);
        return ResponseEntity.ok(applications);
    }
}


