package com.quolance.quolance_api.integration.tests;

import com.quolance.quolance_api.dtos.project.ProjectRejectionDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.helpers.integration.NoOpNotificationConfig;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.NotificationRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.blog.BlogPostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@ContextConfiguration(classes = {NoOpNotificationConfig.class})
class AdminControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private User client;

    @BeforeEach
    void setUp() throws Exception {
        // Clear notifications first to avoid FK constraint issues
        notificationRepository.deleteAll();
        projectRepository.deleteAll();
        userRepository.deleteAll();

        userRepository.save(EntityCreationHelper.createAdmin());
        client = userRepository.save(EntityCreationHelper.createClient());

        session = sessionCreationHelper.getSession("admin@test.com", "Password123!");
    }

    @Test
    void getAllPendingProjectIsOk() throws Exception {
        // Arrange
        Project pendingProject = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));
        projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        // Act
        String response = mockMvc.perform(get("/api/admin/projects/pending/all")
                        .param("page", "0")
                        .param("size", "10")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");

        // Assert
        assertThat(content).hasSize(1);
        Map<String, Object> projectResponse = content.get(0);
        assertThat(projectResponse)
                .containsEntry("id", pendingProject.getId().toString())
                .containsEntry("projectStatus", "PENDING");
    }

    @Test
    void approvePendingProjectIsOkBecomesApproved() throws Exception {
        // Arrange
        Project pendingProject = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));

        // Act
        String response = mockMvc.perform(post("/api/admin/projects/pending/" + pendingProject.getId() + "/approve")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        assertThat(response).isEqualTo("Project approved successfully");
        Project approvedProject = projectRepository.findById(pendingProject.getId()).get();
        assertThat(approvedProject.getProjectStatus()).isEqualTo(ProjectStatus.OPEN);
    }

    @Test
    void approveOpenProjectIsConflict() throws Exception {
        // Arrange
        Project openProject = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.OPEN, client));

        // Act
        String response = mockMvc.perform(post("/api/admin/projects/pending/" + openProject.getId() + "/approve")
                        .session(session))
                .andExpect(status().isConflict())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Project is already in status: OPEN");
    }

    @Test
    void approveClosedProjectIsForbidden() throws Exception {
        // Arrange
        Project closedProject = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, client));

        // Act
        String response = mockMvc.perform(post("/api/admin/projects/pending/" + closedProject.getId() + "/approve")
                        .session(session))
                .andExpect(status().isForbidden())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Project is closed and cannot be updated.");
        assertThat(projectRepository.findById(closedProject.getId()).get().getProjectStatus()).isEqualTo(ProjectStatus.CLOSED);
    }

    @Test
    void rejectPendingProjectIsOkBecomesRejected() throws Exception {
        // Arrange
        Project pendingProject = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.PENDING, client));
        ProjectRejectionDto rejectionDto = new ProjectRejectionDto("This project does not respect platform rules.");

        // Act
        String response = mockMvc.perform(post("/api/admin/projects/pending/" + pendingProject.getId() + "/reject")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(rejectionDto))
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        assertThat(response).isEqualTo("Project rejected successfully");
        Project rejectedProject = projectRepository.findById(pendingProject.getId()).get();
        assertThat(rejectedProject.getProjectStatus()).isEqualTo(ProjectStatus.REJECTED);
        assertThat(rejectedProject.getRejectionReason()).isEqualTo("This project does not respect platform rules.");
    }

    @Test
    void rejectClosedProjectIsForbidden() throws Exception {
        // Arrange
        Project closedProject = projectRepository.save(EntityCreationHelper.createProject(ProjectStatus.CLOSED, client));
        ProjectRejectionDto rejectionDto = new ProjectRejectionDto("This project does not respect platform rules.");

        // Act
        String response = mockMvc.perform(post("/api/admin/projects/pending/" + closedProject.getId() + "/reject")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(rejectionDto))
                        .session(session))
                .andExpect(status().isForbidden())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
        assertThat(jsonResponse).containsEntry("message", "Project is closed and cannot be updated.");
        assertThat(projectRepository.findById(closedProject.getId()).get().getProjectStatus()).isEqualTo(ProjectStatus.CLOSED);
    }

    @Test
    void getAllReportedBlogPosts_onlyReturnsUnresolved() throws Exception {
        // 1) Reported but UNresolved (should appear)
        BlogPost reportedUnresolved = EntityCreationHelper.createBlogPost(client);
        reportedUnresolved.setReported(true);
        reportedUnresolved.setResolved(false);
        reportedUnresolved = blogPostRepository.save(reportedUnresolved);

        // 2) Reported & resolved (should NOT appear in "unresolved" list)
        BlogPost reportedResolved = EntityCreationHelper.createBlogPost(client);
        reportedResolved.setReported(true);
        reportedResolved.setResolved(true);
        blogPostRepository.save(reportedResolved);

        // 3) Not reported at all (should NOT appear)
        BlogPost notReported = EntityCreationHelper.createBlogPost(client);
        notReported.setReported(false);
        notReported.setResolved(false);
        blogPostRepository.save(notReported);

        String responseJson = mockMvc.perform(get("/api/admin/blog-posts/reported")
                        .param("page", "0")
                        .param("size", "10")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // The response is a Page<BlogPostResponseDto>: parse as Map, then get "content"
        Map<String, Object> json = objectMapper.readValue(responseJson, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) json.get("content");
        assertThat(content).hasSize(1);

        Map<String, Object> returnedPost = content.get(0);
        assertThat(returnedPost.get("id")).isEqualTo(reportedUnresolved.getId().toString());
    }

    @Test
    void getAllPreviouslyResolvedBlogPosts_onlyReturnsResolved() throws Exception {
        // 1) Reported & resolved (should appear)
        BlogPost reportedResolved = EntityCreationHelper.createBlogPost(client);
        reportedResolved.setReported(true);
        reportedResolved.setResolved(true);
        reportedResolved = blogPostRepository.save(reportedResolved);

        // 2) Reported but UNresolved (should NOT appear in "resolved" list)
        BlogPost reportedUnresolved = EntityCreationHelper.createBlogPost(client);
        reportedUnresolved.setReported(true);
        reportedUnresolved.setResolved(false);
        blogPostRepository.save(reportedUnresolved);

        // 3) Not reported at all
        BlogPost notReported = EntityCreationHelper.createBlogPost(client);
        notReported.setReported(false);
        notReported.setResolved(false);
        blogPostRepository.save(notReported);

        String responseJson = mockMvc.perform(get("/api/admin/blog-posts/resolved")
                        .param("page", "0")
                        .param("size", "10")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Map<String, Object> json = objectMapper.readValue(responseJson, Map.class);
        List<Map<String, Object>> content = (List<Map<String, Object>>) json.get("content");
        assertThat(content).hasSize(1);

        Map<String, Object> returnedPost = content.get(0);
        assertThat(returnedPost.get("id")).isEqualTo(reportedResolved.getId().toString());
    }

    @Test
    void keepReportedBlogPost_setsResolvedTrue() throws Exception {
        // 1) Reported but unresolved
        BlogPost reportedUnresolved = EntityCreationHelper.createBlogPost(client);
        reportedUnresolved.setReported(true);
        reportedUnresolved.setResolved(false);
        reportedUnresolved = blogPostRepository.save(reportedUnresolved);

        // 2) Perform the POST call
        mockMvc.perform(post("/api/admin/blog-posts/reported/" + reportedUnresolved.getId() + "/keep")
                        .session(session))
                .andExpect(status().isOk());

        // 3) Verify in DB that isResolved is now true
        BlogPost updated = blogPostRepository.findById(reportedUnresolved.getId()).orElseThrow();
        assertThat(updated.isReported()).isTrue();
        assertThat(updated.isResolved()).isTrue();
    }

    @Test
    void deleteReportedBlogPost_removesEntityFromDb() throws Exception {
        // 1) Reported but unresolved
        BlogPost reportedUnresolved = EntityCreationHelper.createBlogPost(client);
        reportedUnresolved.setReported(true);
        reportedUnresolved.setResolved(false);
        reportedUnresolved = blogPostRepository.save(reportedUnresolved);

        // 2) Perform the DELETE call
        mockMvc.perform(delete("/api/admin/blog-posts/reported/" + reportedUnresolved.getId())
                        .session(session).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // 3) Verify it's removed
        assertThat(blogPostRepository.findById(reportedUnresolved.getId())).isEmpty();
    }
}
