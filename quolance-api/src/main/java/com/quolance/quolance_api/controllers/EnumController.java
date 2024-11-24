package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.entities.enums.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/enums")
public class EnumController {

    @GetMapping("/project-categories")
    public ResponseEntity<List<String>> getProjectCategories() {
        List<String> categories = Arrays.stream(ProjectCategory.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/application-status")
    public ResponseEntity<List<String>> getApplicationStatuses() {
        List<String> statuses = Arrays.stream(ApplicationStatus.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/expected-delivery-times")
    public ResponseEntity<List<String>> getExpectedDeliveryTimes() {
        List<String> deliveryTimes = Arrays.stream(ExpectedDeliveryTime.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(deliveryTimes);
    }

    @GetMapping("/freelancer-experience-levels")
    public ResponseEntity<List<String>> getFreelancerExperienceLevels() {
        List<String> experienceLevels = Arrays.stream(FreelancerExperienceLevel.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(experienceLevels);
    }

    @GetMapping("/price-ranges")
    public ResponseEntity<List<String>> getPriceRanges() {
        List<String> priceRanges = Arrays.stream(PriceRange.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(priceRanges);
    }

    @GetMapping("/project-statuses")
    public ResponseEntity<List<String>> getProjectStatuses() {
        List<String> statuses = Arrays.stream(ProjectStatus.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getRoles() {
        List<String> roles = Arrays.stream(Role.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/tags")
    public ResponseEntity<List<String>> getTags() {
        List<String> tags = Arrays.stream(Tag.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(tags);
    }
}
