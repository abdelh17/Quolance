package com.quolance.quolance_api.helpers;

import com.quolance.quolance_api.entities.*;
import com.quolance.quolance_api.entities.enums.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Helper class to create entities for testing purposes
 */
public class EntityCreationHelper {
    public static Application createApplication(Project project, User freelancer) {
        Application application = new Application();
        application.setProject(project);
        application.setFreelancer(freelancer);
        return application;
    }

    public static User createAdmin() {
        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("Test");
        admin.setEmail("admin@test.com");
        admin.setUsername("MyAdmin123");
        admin.setRole(Role.ADMIN);
        admin.setVerified(true);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("Password123!");
        admin.setPassword(encodedPassword);
        return admin;
    }

    public static User createClient() {
        User client = new User();
        client.setFirstName("Client");
        client.setLastName("Test");
        client.setEmail("client@test.com");
        client.setUsername("MyClient123");
        client.setRole(Role.CLIENT);
        client.setVerified(true);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("Password123!");
        client.setPassword(encodedPassword);
        return client;
    }

    //userNumber is used to create unique email addresses for each user when there is a need to create multiple users
    public static User createFreelancer(int userNumber) {
        User freelancer = new User();
        freelancer.setFirstName("Freelancer" + userNumber);
        freelancer.setLastName("Test");
        freelancer.setEmail("freelancer" + userNumber + "@test.com");
        freelancer.setUsername("MyFreelancer" + userNumber);
        freelancer.setRole(Role.FREELANCER);
        freelancer.setVerified(true);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode("Password123!");
        freelancer.setPassword(encodedPassword);

        Profile profile = new Profile();
        profile.setBio(freelancer.getFirstName() + " bio");
        profile.setAvailability(Availability.FULL_TIME);
        profile.setUser(freelancer);

        freelancer.setProfile(profile);
        return freelancer;
    }

    public static Project createProject(ProjectStatus projectStatus, User client) {
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

    public static Project createProject(ProjectStatus projectStatus, LocalDate visibilityExpirationDate, User client) {
        Project project = new Project();
        project.setTitle("title");
        project.setDescription("description");
        project.setCategory(ProjectCategory.APP_DEVELOPMENT);
        project.setPriceRange(PriceRange.LESS_500);
        project.setExperienceLevel(FreelancerExperienceLevel.JUNIOR);
        project.setExpectedDeliveryTime(ExpectedDeliveryTime.FLEXIBLE);
        project.setVisibilityExpirationDate(visibilityExpirationDate);
        project.setProjectStatus(projectStatus);
        project.setClient(client);
        return project;
    }

    public static BlogPost createBlogPost(User user) {
        BlogPost blogPost = new BlogPost();
        blogPost.setContent("This is a test blog post.");
        blogPost.setUser(user);
        return blogPost;
    }

    public static BlogComment createBlogComment(User user, BlogPost blogPost) {
        BlogComment blogComment = new BlogComment();
        blogComment.setContent("This is a test comment.");
        blogComment.setUser(user);
        blogComment.setBlogPost(blogPost);
        return blogComment;
    }
}
