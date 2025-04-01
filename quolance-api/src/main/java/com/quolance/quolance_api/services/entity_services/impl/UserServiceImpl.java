package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.users.*;
import com.quolance.quolance_api.entities.*;
import com.quolance.quolance_api.entities.enums.ApplicationStatus;
import com.quolance.quolance_api.entities.enums.ProjectStatus;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.jobs.SendResetPasswordEmailJob;
import com.quolance.quolance_api.repositories.ApplicationRepository;
import com.quolance.quolance_api.repositories.PasswordResetTokenRepository;
import com.quolance.quolance_api.repositories.ProjectRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.auth.VerificationCodeService;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.services.websockets.impl.NotificationMessageService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationCodeService verificationCodeService;
    private final ProjectRepository projectRepository;
    private final ApplicationRepository applicationRepository;
    private NotificationMessageService notificationMessageService;

    @Override
    @Transactional
    public UserResponseDto create(CreateUserRequestDto request) {
        log.debug("Attempting to create new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("User creation failed - email already exists: {}", request.getEmail());
            throw new ApiException("A user with this email already exists.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("User creation failed - username already exists: {}", request.getUsername());
            throw new ApiException("A user with this username already exists.");
        }

        User user = new User(request);
        user = userRepository.save(user);
        log.info("Successfully created new user with ID: {}", user.getId());

        sendVerificationEmail(user);
        log.debug("Verification email process initiated for user ID: {}", user.getId());

        return new UserResponseDto(user);
    }

    @Override
    @Transactional
    public UserResponseDto createAdmin(CreateAdminRequestDto request) {
        log.debug("Attempting to create new admin user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Admin creation failed - email already exists: {}", request.getEmail());
            throw new ApiException("A user with this email already exists.");
        }

        User user = new User(request);
        user.setVerified(true);
        user = userRepository.save(user);

        log.info("Successfully created new admin user with ID: {}", user.getId());

        return new UserResponseDto(user);
    }

    @Override
    public void updateProfilePicture(User user, String photoUrl) {
        log.debug("Updating profile picture for user ID: {}", user.getId());
        user.setProfileImageUrl(photoUrl);
        userRepository.save(user);
        log.info("Successfully updated profile picture for user ID: {}", user.getId());
    }

    @Override
    public Page<User> findAllWithFilters(Specification<User> spec, Pageable pageable) {
        log.debug("Fetching users with filters: {}", spec);
        Page<User> users = userRepository.findAll(spec, pageable);
        log.debug("Found {} users matching criteria", users.getTotalElements());
        return users;
    }

    @Override
    public Optional<User> findById(UUID id) {
        log.debug("Looking up user by ID: {}", id);
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            log.debug("Found user with ID: {}", id);
        } else {
            log.debug("No user found with ID: {}", id);
        }
        return user;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        log.debug("Looking up user by username: {}", username);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            log.debug("Found user with username: {} and ID: {}", username, user.get().getId());
        } else {
            log.debug("No user found with username: {}", username);
        }
        return user;
    }

    private User findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            log.warn("No user found with email: {}", email);
            return ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("User not found")
                    .build();
        });
        return user;
    }

    private void sendVerificationEmail(User user) {
        log.debug("Creating verification code for user ID: {}", user.getId());
        verificationCodeService.sendVerificationCode(user);
    }

    @Override
    public void resendVerificationEmail(String email) {
        User user = findByEmail(email);
        log.debug("Attempting to resend verification email for user: {}", user.getEmail());
        if (user.isVerified()) {
            log.warn("Resend verification email failed - user already verified: {}", email);
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Email already verified")
                    .build();
        }
        verificationCodeService.deleteVerificationCode(user.getVerificationCode());
        verificationCodeService.sendVerificationCode(user);
    }

    @Override
    @Transactional
    public String verifyEmail(VerifyEmailDto verifyEmailDto) {
        log.debug("Attempting to verify email: {}", verifyEmailDto.getEmail());
        VerificationCode verificationCode = verificationCodeService.findByCode(verifyEmailDto.getVerificationCode());
        User user = findByEmail(verifyEmailDto.getEmail());

        if (user.isVerified()) {
            log.warn("User {} - already verified.", verifyEmailDto.getEmail());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Email already verified")
                    .build();
        }
        if (verificationCode == null) {
            log.warn("Email verification failed for {} - invalid code.", verifyEmailDto.getEmail());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_NOT_FOUND)
                    .message("Invalid code")
                    .build();
        }
        if (!verificationCode.getCode().equals(verifyEmailDto.getVerificationCode())) {
            log.warn("Email verification failed for {} - invalid code: {}", verifyEmailDto.getEmail());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Invalid code")
                    .build();
        }

        user.setVerified(true);
        userRepository.save(user);
        verificationCodeService.deleteVerificationCode(verificationCode);
        log.info("Successfully verified email for: {}", user.getEmail());
        return "Email verified successfully";
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        log.debug("Processing forgot password request for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Forgot password request failed - user not found: {}", email);
                    return ApiException.builder()
                            .status(HttpServletResponse.SC_NOT_FOUND)
                            .message("User not found")
                            .build();
                });

        PasswordResetToken passwordResetToken = new PasswordResetToken(user);
        passwordResetTokenRepository.save(passwordResetToken);

        SendResetPasswordEmailJob sendResetPasswordEmailJob = new SendResetPasswordEmailJob(passwordResetToken.getId());
        BackgroundJobRequest.enqueue(sendResetPasswordEmailJob);
        log.info("Password reset email queued for user ID: {}", user.getId());
    }

    @Override
    @Transactional
    public void resetPassword(UpdateUserPasswordRequestDto request) {
        log.debug("Attempting to reset password with token");
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(request.getPasswordResetToken())
                .orElseThrow(() -> {
                    log.warn("Password reset failed - token not found");
                    return ApiException.builder()
                            .status(HttpServletResponse.SC_NOT_FOUND)
                            .message("Password reset token not found")
                            .build();
                });

        if (passwordResetToken.isExpired()) {
            log.warn("Password reset failed - token expired for user ID: {}",
                    passwordResetToken.getUser().getId());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Password reset token is expired")
                    .build();
        }

        User user = passwordResetToken.getUser();
        user.updatePassword(request.getPassword());
        userRepository.save(user);
        log.info("Successfully reset password for user ID: {}", user.getId());
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(UpdateUserRequestDto request, User user) {
        log.debug("Updating user information for user ID: {}", user.getId());
        user.updateUserInfo(request);
        user = userRepository.save(user);
        log.info("Successfully updated user information for user ID: {}", user.getId());
        return new UserResponseDto(user);
    }

    @Override
    public void updateUserName(String username, User user) {
        log.debug("Updating username to '{}' for user ID: {}", username, user.getId());
        user.setUsername(username);
        userRepository.save(user);
        log.info("Successfully updated username for user ID: {}", user.getId());
    }

    @Override
    @Transactional
    public UserResponseDto updatePassword(UpdateUserPasswordRequestDto request, User user) {
        log.debug("Attempting to update password for user ID: {}", user.getId());

        if (user.getPassword() != null && !passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            log.warn("Password update failed - incorrect old password for user ID: {}", user.getId());
            throw ApiException.builder()
                    .status(HttpServletResponse.SC_BAD_REQUEST)
                    .message("Wrong password")
                    .build();
        }

        user.updatePassword(request.getPassword());
        user = userRepository.save(user);
        log.info("Successfully updated password for user ID: {}", user.getId());
        return new UserResponseDto(user);
    }

    @Override
    public void updateNotificationSubscription(User user, boolean subscribed) {
        user.setNotificationsSubscribed(subscribed);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(User user) {
        LocalDateTime timeInterval = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);

        Role role = user.getRole();

        if (role == Role.ADMIN) {
        }
        else if (role == Role.CLIENT){
            List<Project> projects = projectRepository.findProjectsByClientId(user.getId());
            for(Project project : projects){


                if(project.getSelectedFreelancer() != null){
                    if(project.getLastModifiedDate().isAfter(timeInterval)){

                        User selectedFreelancer = project.getSelectedFreelancer();

                        String notifMessage = "A project that you were selected for was rescinded by the client." +
                                              "This can be due to reasons such as the project being cancelled or the client's account being deleted." +
                                              "Please verify the status of your application if still in progress." +
                                              "Project Name: " + project.getTitle();

                        notificationMessageService.sendNotificationToUser(selectedFreelancer,selectedFreelancer, notifMessage);

                    }

                }
                project.setProjectStatus(ProjectStatus.EXPIRED);
                projectRepository.save(project);
            }

        }
        else if (role == Role.FREELANCER){
            List<Application> applications = applicationRepository.findApplicationsByFreelancerId(user.getId());
            for(Application application : applications){

                Project appliedToProject = application.getProject();

                if(appliedToProject.getSelectedFreelancer() != null && appliedToProject.getSelectedFreelancer().getId().equals(user.getId())){

                        if(appliedToProject.getLastModifiedDate().isAfter(timeInterval)){

                            String notifMessage = "A freelancer you selected for the project: " + appliedToProject.getTitle() + " is no longer available." +
                                    "As a result, they may be unable to proceed with the project." +
                                    "Please verify the status of your project if still in progress.";

                            User affectedClient = appliedToProject.getClient();
                            notificationMessageService.sendNotificationToUser(affectedClient,affectedClient, notifMessage);

                        }
                }
                application.setApplicationStatus(ApplicationStatus.CANCELLED);
                applicationRepository.save(application);
            }
        }

        user.setDeleted(true);
        userRepository.save(user);
    }

    @Autowired
    public void setNotificationMessageService(@Lazy NotificationMessageService notificationMessageService) {
        this.notificationMessageService = notificationMessageService;
    }

}