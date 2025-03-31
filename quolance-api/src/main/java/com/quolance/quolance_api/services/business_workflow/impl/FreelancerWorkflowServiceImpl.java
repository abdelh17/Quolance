package com.quolance.quolance_api.services.business_workflow.impl;

import com.quolance.quolance_api.dtos.application.ApplicationCreateDto;
import com.quolance.quolance_api.dtos.application.ApplicationDto;
import com.quolance.quolance_api.dtos.profile.FreelancerProfileDto;
import com.quolance.quolance_api.dtos.profile.UpdateFreelancerProfileDto;
import com.quolance.quolance_api.dtos.project.ProjectFilterDto;
import com.quolance.quolance_api.dtos.project.ProjectPublicDto;
import com.quolance.quolance_api.dtos.review.ReviewDto;
import com.quolance.quolance_api.dtos.users.UpdateUserRequestDto;
import com.quolance.quolance_api.entities.*;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.services.ai_models.recommendation.ProfileEmbeddingService;
import com.quolance.quolance_api.services.business_workflow.FreelancerWorkflowService;
import com.quolance.quolance_api.services.entity_services.*;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.SecurityUtil;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.persistence.OptimisticLockException;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FreelancerWorkflowServiceImpl implements FreelancerWorkflowService {

    private final ProjectService projectService;
    private final ApplicationService applicationService;
    private final UserService userService;
    private final FileService fileService;
    private final ReviewService reviewService;
    private final NotificationMessageService notificationMessageService;
    private final ProfileEmbeddingService profileService;

    @Override
    public void submitApplication(ApplicationCreateDto applicationCreateDto, User freelancer) {

        if (applicationService.getApplicationByFreelancerIdAndProjectId(freelancer.getId(), applicationCreateDto.getProjectId()) != null) {
            log.info("User with ID: {} has already applied to project with ID: {}", freelancer.getId(), applicationCreateDto.getProjectId());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("You have already applied to this project.")
                    .build();
        }

        try {
            Application application = ApplicationCreateDto.toEntity(applicationCreateDto);
            Project project = projectService.getProjectById(applicationCreateDto.getProjectId());

            if (!project.isProjectApproved()) {
                throw ApiException.builder()
                        .status(HttpServletResponse.SC_CONFLICT)
                        .message("You can't apply to this project.")
                        .build();
            }

            application.setFreelancer(freelancer);
            application.setProject(project);
            application.setMessage(applicationCreateDto.getMessage());
            applicationService.saveApplication(application);

            // Notify freelancer that the application was submitted successfully.
            String freelancerNotification = "Your application for project '" + project.getTitle() + "' has been submitted successfully.";
            notificationMessageService.sendNotificationToUser(freelancer, freelancer, freelancerNotification);

            // Optionally, notify the project owner that a new application has been received.
            User client = project.getClient();
            if (client != null) {
                String clientNotification = "A new application has been submitted to your project '" + project.getTitle() + "'.";
                notificationMessageService.sendNotificationToUser(client, client, clientNotification);
            }
        } catch (OptimisticLockException e) {
            handleOptimisticLockException(e);
        }

    }

    @Override
    public ApplicationDto getApplication(UUID applicationId, User freelancer) {
        Application application = applicationService.getApplicationById(applicationId);
        if (!application.isOwnedBy(freelancer.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to view this application.")
                    .build();
        }
        return ApplicationDto.fromEntity(application);
    }

    @Override
    public void deleteApplication(UUID applicationId, User freelancer) {
        Application application = applicationService.getApplicationById(applicationId);
        if (!application.isOwnedBy(freelancer.getId())) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_FORBIDDEN)
                    .message("You are not authorized to delete this application.")
                    .build();
        }
        applicationService.deleteApplication(application);

        // Notify freelancer that the application has been deleted.
        String deletionNotification = "Your application for project '" + application.getProject().getTitle() + "' has been deleted.";
        notificationMessageService.sendNotificationToUser(freelancer, freelancer, deletionNotification);
    }

    @Override
    public Boolean hasFreelancerAppliedToProject(UUID freelancerId, UUID projectId) {
        return applicationService.getApplicationByFreelancerIdAndProjectId(freelancerId, projectId) != null;
    }

    @Override
    public Page<ApplicationDto> getAllFreelancerApplications(User freelancer, Pageable pageable) {
        Page<Application> applicationPage = applicationService.getAllApplicationsByFreelancerId(freelancer.getId(), pageable);
        return applicationPage.map(ApplicationDto::fromEntity);
    }

    @Override
    public Page<ProjectPublicDto> getAllVisibleProjects(Pageable pageable, ProjectFilterDto filters) {
        LocalDate currentDate = LocalDate.now();

        Specification<Project> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Add status filter (OPEN or CLOSED)
            predicates.add(root.get("projectStatus").in(List.of(ProjectStatus.OPEN, ProjectStatus.CLOSED)));

            // Add visibility date check for CLOSED projects
            Predicate isOpen = criteriaBuilder.equal(root.get("projectStatus"), ProjectStatus.OPEN);
            Predicate isClosedAndVisible = criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("projectStatus"), ProjectStatus.CLOSED),
                    criteriaBuilder.greaterThanOrEqualTo(root.get("visibilityExpirationDate"), currentDate)
            );
            predicates.add(criteriaBuilder.or(isOpen, isClosedAndVisible));

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

                if (filters.getApplied() != null) {
                    User freelancerUser = SecurityUtil.getAuthenticatedUser();
                    Subquery<UUID> subquery = query.subquery(UUID.class);
                    Root<Application> applicationRoot = subquery.from(Application.class);
                    subquery.select(applicationRoot.get("project").get("id"))
                            .where(criteriaBuilder.equal(applicationRoot.get("freelancer").get("id"), freelancerUser.getId()));

                    if (filters.getApplied()) {
                        predicates.add(root.get("id").in(subquery));
                    } else {
                        predicates.add(criteriaBuilder.not(root.get("id").in(subquery)));
                    }
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Project> projectPage = projectService.findAllWithFilters(spec, pageable);
        return projectPage.map(ProjectPublicDto::fromEntity);
    }

    @Override
    public ProjectPublicDto getProject(UUID projectId) {

        Project project = projectService.getProjectById(projectId);
        LocalDate currentDate = LocalDate.now();

        if (project.getProjectStatus().equals(ProjectStatus.PENDING)) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("Project is not yet approved.")
                    .build();
        }
        if (project.getVisibilityExpirationDate() != null &&
                project.getVisibilityExpirationDate().isBefore(currentDate)) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_CONFLICT)
                    .message("Project visibility has expired.")
                    .build();
        }
        return ProjectPublicDto.fromEntity(project);
    }

    @Override
    public FreelancerProfileDto getFreelancerProfile(String username) {
        Optional<User> freelancer = userService.findByUsername(username);

        if (freelancer.isPresent() && freelancer.get().getProfile() != null) {
            // iterate through all reviews and convert to dto
            List<Review> reviews = reviewService.getAllReviewsByFreelancerId(freelancer.get().getId());
            List<ReviewDto> reviewDtos = reviews.stream()
                    .map(ReviewDto::fromEntity)
                    .collect(Collectors.toList());

            FreelancerProfileDto freelancerProfileDto = FreelancerProfileDto.fromEntity(freelancer.get());
            freelancerProfileDto.setReviews(reviewDtos);
            return freelancerProfileDto;
        } else {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("Freelancer or profile not found")
                    .build();
        }
    }

    @Override
    public void updateFreelancerProfile(UpdateFreelancerProfileDto updateFreelancerProfileDto, User freelancer) {
        try {
            Profile profile = freelancer.getProfile();
            if (profile == null) {
                profile = new Profile();
                profile.setUser(freelancer);
                freelancer.setProfile(profile);
            }

            // Update all profile fields with new values from DTO
            profile.setBio(updateFreelancerProfileDto.getBio());
            profile.setContactEmail(updateFreelancerProfileDto.getContactEmail());
            profile.setCity(updateFreelancerProfileDto.getCity());
            profile.setState(updateFreelancerProfileDto.getState());
            profile.setExperienceLevel(updateFreelancerProfileDto.getExperienceLevel());
            profile.setSocialMediaLinks(updateFreelancerProfileDto.getSocialMediaLinks());
            profile.setSkills(updateFreelancerProfileDto.getSkills());
            profile.setAvailability(updateFreelancerProfileDto.getAvailability());
            profile.setWorkExperiences(updateFreelancerProfileDto.getWorkExperiences());
            profile.setCertifications(updateFreelancerProfileDto.getCertifications());
            profile.setLanguagesSpoken(updateFreelancerProfileDto.getLanguagesSpoken());
            profile.setProjectExperiences(updateFreelancerProfileDto.getProjectExperiences());

            // Update the freelancer's embedding based on the new profile data
            profileService.updateProfileEmbedding(profile);

            UpdateUserRequestDto updateUserRequestDto = UpdateUserRequestDto.builder()
                    .firstName(updateFreelancerProfileDto.getFirstName())
                    .lastName(updateFreelancerProfileDto.getLastName())
                    .build();

            userService.updateUser(updateUserRequestDto, freelancer);

            // Notify freelancer that their profile has been updated.
            String profileUpdateNotification = "Your profile has been updated successfully.";
            notificationMessageService.sendNotificationToUser(freelancer, freelancer, profileUpdateNotification);

        } catch (OptimisticLockException e) {
            handleOptimisticLockException(e);
        } catch (Exception e) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                    .message("Failed to update profile")
                    .errors(Map.of("updateError", e.getMessage()))
                    .build();
        }
    }

    @Override
    public void uploadProfilePicture(MultipartFile photo, User freelancer) {
        try {
            Map<String, Object> uploadResult = fileService.uploadFile(photo, freelancer);
            String photoUrl = uploadResult.get("secure_url").toString();

            userService.updateProfilePicture(freelancer, photoUrl);

            // Notify freelancer that their profile picture has been updated.
            String pictureUpdateNotification = "Your profile picture has been updated successfully.";
            notificationMessageService.sendNotificationToUser(freelancer, freelancer, pictureUpdateNotification);

        } catch (Exception e) {
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_INTERNAL_SERVER_ERROR)
                    .message("Failed to upload profile picture")
                    .errors(Map.of("uploadError", e.getMessage()))
                    .build();
        }
    }

    // Helper method to handle optimistic lock exception
    private void handleOptimisticLockException(Exception e) {
        throw ApiException.builder()
                .status(HttpServletResponse.SC_CONFLICT)
                .message("The resource was modified by another user. Please refresh the page and try again.")
                .errors(Map.of("optimisticLock", e.getMessage()))
                .build();
    }
}