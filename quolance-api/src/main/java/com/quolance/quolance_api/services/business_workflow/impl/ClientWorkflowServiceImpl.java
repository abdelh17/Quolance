package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileFilterDto;
import com.quolance.quolance_api.dtos.project.*;
import com.quolance.quolance_api.dtos.review.ReviewCreateDto;
import com.quolance.quolance_api.dtos.review.ReviewDto;
import com.quolance.quolance_api.entities.Project;
import com.quolance.quolance_api.entities.Review;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.entities.enums.Tag;
import com.quolance.quolance_api.services.business_workflow.ClientWorkflowService;
import com.quolance.quolance_api.services.entity_services.ApplicationService;
import com.quolance.quolance_api.services.entity_services.ProjectService;
import com.quolance.quolance_api.services.entity_services.ReviewService;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.FeatureToggle;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.criteria.Predicate;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientWorkflowServiceImpl implements ClientWorkflowService {

    private final ProjectService projectService;
    private final ApplicationService applicationService;
    private final UserService userService;
    private final ReviewService reviewService;
    private final NotificationMessageService notificationMessageService;
    private final FeatureToggle featureToggle;

    @Override
    @Transactional
    public ProjectEvaluationResult createProject(ProjectCreateDto projectCreateDto, User client) {
        log.info("Creating project for client: {}", client.getId());

        Project projectToSave = ProjectCreateDto.toEntity(projectCreateDto);
        projectToSave.setExpirationDate(projectCreateDto.getExpirationDate() != null ?
                projectCreateDto.getExpirationDate() : LocalDate.now().plusDays(7));
        projectToSave.setClient(client);
        projectToSave.setProjectStatus(ProjectStatus.PENDING);
        Project savedProject = projectService.saveProject(projectToSave);

        // Notify client that the project has been created successfully.
        String creationMessage = "Your project '" + savedProject.getTitle() + "' has been created successfully.";
        notificationMessageService.sendNotificationToUser(client, client, creationMessage);

        if (featureToggle.isEnabled("useAiProjectEvaluation")) {
            log.info("Automated evaluation of project enabled. AI evaluation of project for approval....");
            ProjectEvaluationResult result = projectService.evaluateProjectForApproval(savedProject);
            result.setProjectId(savedProject.getId());

            // Notify client about the AI evaluation result.
            String evalMessage = "Your project '" + savedProject.getTitle() + "' has been evaluated by AI.";
            notificationMessageService.sendNotificationToUser(client, client, evalMessage);
            return result;
        } else {
            log.info("Automated evaluation of project disabled.");
            ProjectEvaluationResult result = new ProjectEvaluationResult();
            result.setProjectId(savedProject.getId());
            return result;
        }
    }

    @Override
    public ProjectDto getProject(UUID projectId, User client) {
        Project project = projectService.getProjectById(projectId);
        return ProjectDto.fromEntity(project);
    }

    @Override
    public void deleteProject(UUID projectId, User client) {
        Project project = projectService.getProjectById(projectId);

        if (!project.isOwnedBy(client.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to remove this project")
                    .build();
        }

        projectService.deleteProject(project);

    }

    @Override
    public Page<ProjectDto> getAllClientProjects(User client, Pageable pageable, ProjectFilterDto filters) {
        Specification<Project> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("client").get("id"), client.getId()));

            // Add search filters if provided
            if (filters != null) {
                if (filters.getSearchTitle() != null && !filters.getSearchTitle().trim().isEmpty()) {
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("title")),
                            "%" + filters.getSearchTitle().toLowerCase() + "%"
                    ));
                }

                if (filters.getCategory() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("category"), filters.getCategory()));
                }

                if (filters.getPriceRange() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("priceRange"), filters.getPriceRange()));
                }

                if (filters.getExperienceLevel() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("experienceLevel"), filters.getExperienceLevel()));
                }

                if (filters.getProjectStatus() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("projectStatus"), filters.getProjectStatus()));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Project> projectPage = projectService.findAllWithFilters(spec, pageable);
        return projectPage.map(ProjectDto::fromEntity);
    }

    @Override
    public List<ApplicationDto> getAllApplicationsToProject(UUID projectId, User client) {
        Project project = projectService.getProjectById(projectId);

        if (!project.isOwnedBy(client.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to view this project applications")
                    .build();
        }

        return applicationService.getAllApplicationsByProjectId(projectId).stream()
                .map(ApplicationDto::fromEntity)
                .toList();
    }

    @Override
    public ProjectDto updateProject(UUID projectId, ProjectUpdateDto projectUpdateDto, User client) {
        Project existingProject = projectService.getProjectById(projectId);

        if (!existingProject.isOwnedBy(client.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You don't have permission to update this project")
                    .build();
        }

        projectService.updateProject(existingProject, projectUpdateDto);

        return ProjectDto.fromEntity(existingProject);
    }

    @Override
    public Page<FreelancerProfileDto> getAllAvailableFreelancers(Pageable pageable, FreelancerProfileFilterDto filters) {
        Specification<User> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.isFalse(root.get("deleted")));

            if (filters != null) {
                if (filters.getSearchName() != null && !filters.getSearchName().trim().isEmpty()) {
                    String searchPattern = "%" + filters.getSearchName().toLowerCase() + "%";

                    Predicate firstNamePredicate = criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("firstName")), searchPattern);
                    Predicate lastNamePredicate = criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("lastName")), searchPattern);

                    Predicate combinedPredicate = criteriaBuilder.or(firstNamePredicate, lastNamePredicate);
                    predicates.add(combinedPredicate);
                }

                if (filters.getExperienceLevel() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("profile").get("experienceLevel"), filters.getExperienceLevel()));
                }

                if (filters.getAvailability() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("profile").get("availability"), filters.getAvailability()));
                }

                if (filters.getSkills() != null && !filters.getSkills().isEmpty()) {
                    for (Tag skill : filters.getSkills()) {
                        predicates.add(root.join("profile").join("skills").in(skill));
                    }
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        Page<User> userPage = userService.findAllWithFilters(spec, pageable);
        List<FreelancerProfileDto> freelancerDtos = userPage.stream()
                .map(user -> user.getProfile() != null ? FreelancerProfileDto.fromEntity(user) : null)
                .filter(Objects::nonNull)
                .toList();

        return new PageImpl<>(freelancerDtos, pageable, freelancerDtos.size());

    }

    @Override
    public void reviewFreelancer(ReviewCreateDto reviewCreateDto, User client) {
        UUID projectId = reviewCreateDto.getProjectId();
        log.debug("Reviewing freelancer for project: {}", projectId);
        log.debug("Fetching project with ID: {}", projectId);
        Project project = projectService.getProjectById(projectId);
        User freelancer = project.getSelectedFreelancer();

        if (!project.isOwnedBy(client.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to review this freelancer for that project")
                    .build();
        }

        // Check that the project is OPEN or CLOSED and it has a freelancer assigned
        if (project.getProjectStatus() != ProjectStatus.OPEN && project.getProjectStatus() != ProjectStatus.CLOSED) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("You cannot review a freelancer for a project that is not open or closed")
                    .build();
        }

        if (freelancer == null) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("You cannot review a freelancer for a project that has no freelancer assigned")
                    .build();
        }

        // Check that the project has not been reviewed already
        Review existingReview = reviewService.getReviewByProjectId(projectId);
        if (existingReview != null) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("You have already reviewed the freelancer for this project")
                    .build();
        }

        Review review = ReviewCreateDto.toEntity(reviewCreateDto, project, freelancer);
        reviewService.saveReview(review);
        log.debug("Review saved successfully for freelancer: {}", freelancer.getId());
    }

}
