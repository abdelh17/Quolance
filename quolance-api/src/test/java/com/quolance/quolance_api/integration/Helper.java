package com.quolance.quolance_api.integration;

import com.quolance.quolance_api.entities.Application;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Helper {
    static Application createApplication(Project project, User freelancer) {
        Application application = new Application();
        application.setProject(project);
        application.setFreelancer(freelancer);
        return application;
    }

    static User createClient() {
        User client = new User();
        client.setFirstName("Client");
        client.setLastName("Test");
        client.setEmail("client@test.com");
        client.setRole(Role.CLIENT);
        client.setVerified(true);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("Password123!");
        client.setPassword(encodedPassword);
        return client;
    }

    //userNumber is used to create unique email addresses for each user when there is a need to create multiple users
    static User createFreelancer(int userNumber) {
        User freelancer = new User();
        freelancer.setFirstName("Freelancer" + userNumber);
        freelancer.setLastName("Test");
        freelancer.setEmail("freelancer" + userNumber + "@test.com");
        freelancer.setRole(Role.FREELANCER);
        freelancer.setVerified(true);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("Password123!");
        freelancer.setPassword(encodedPassword);
        return freelancer;
    }

    static Project createProject(ProjectStatus projectStatus, User client) {
        Project project = new Project();
        project.setTitle("title");
        project.setDescription("description");
        project.setCategory(ProjectCategory.APP_DEVELOPMENT);
        project.setPriceRange(PriceRange.LESS_500);
        project.setExperienceLevel(FreelancerExperienceLevel.JUNIOR);
        project.setExpectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE);
        project.setProjectStatus(projectStatus);
        project.setClient(client);
        return project;
    }
}