package com.quolance.quolance_api.helpers.integration;

import com.quolance.quolance_api.entities.*;
import com.quolance.quolance_api.entities.blog.BlogComment;
import com.quolance.quolance_api.entities.blog.BlogImage;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.blog.Reaction;
import com.quolance.quolance_api.entities.enums.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
//        blogPost.setDateCreated(LocalDateTime.now());
//        blogPost.setLastModified(LocalDateTime.now());
        blogPost.setReported(false);
        blogPost.setResolved(false);
        return blogPost;
    }

    public static BlogPost createFullBlogPost(User user, String title, String content, List<BlogTags> tags, LocalDateTime creationDate) {
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(title);
        blogPost.setContent(content);
        blogPost.setUser(user);
        blogPost.setTags(Set.copyOf(tags));
//        blogPost.setDateCreated(creationDate);
//        blogPost.setLastModified(creationDate);
        blogPost.setReported(false);
        blogPost.setResolved(false);
        return blogPost;
    }

    public static BlogPost createBlogPostWithImages(User user) {
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle("Blog Post with Images");
        blogPost.setContent("This is a test blog post with images.");
        blogPost.setUser(user);
//        blogPost.setDateCreated(LocalDateTime.now());
//        blogPost.setLastModified(LocalDateTime.now());
        blogPost.setReported(false);
        blogPost.setResolved(false);

        // Create dummy BlogImage entities
        BlogImage image1 = BlogImage.builder().imagePath("https://example.com/image1.jpg").build();
        BlogImage image2 = BlogImage.builder().imagePath("https://example.com/image2.jpg").build();

        // Associate images with the blog post
        image1.setBlogPost(blogPost);
        image2.setBlogPost(blogPost);

        // Add the images to the blog post
        blogPost.setImages(List.of(image1, image2));

        return blogPost;
    }

    public static BlogComment createBlogComment(User user, BlogPost blogPost) {
        BlogComment blogComment = new BlogComment();
        blogComment.setContent("This is a test comment.");
        blogComment.setUser(user);
        blogComment.setBlogPost(blogPost);
        return blogComment;
    }

    public static Reaction createReaction(User user, BlogPost blogPost, ReactionType reactionType) {

        Reaction reaction = new Reaction();

        reaction.setUser(user);

        reaction.setBlogPost(blogPost);

        reaction.setReactionType(reactionType);

        return reaction;

    }

    public static Message createMessage(User sender, User recipient, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(recipient);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return message;
    }
}
