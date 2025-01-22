package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.*;
import com.quolance.quolance_api.entities.PasswordResetToken;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.jobs.SendResetPasswordEmailJob;
import com.quolance.quolance_api.jobs.SendWelcomeEmailJob;
import com.quolance.quolance_api.repositories.PasswordResetTokenRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.repositories.VerificationCodeRepository;
import com.quolance.quolance_api.services.entity_services.UserService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.jobrunr.scheduling.BackgroundJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponseDto create(CreateUserRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("A user with this email already exists.");
        }
        User user = new User(request);
        user = userRepository.save(user);
        sendVerificationEmail(user);

        return new UserResponseDto(user);
    }

    @Override
    @Transactional
    public UserResponseDto createAdmin(CreateAdminRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("A user with this email already exists.");
        }
        User user = new User(request);
        user = userRepository.save(user);
        return new UserResponseDto(user);
    }

    @Override
    public void updateProfilePicture(User user, String photoUrl) {
        user.setProfileImageUrl(photoUrl);
        userRepository.save(user);
    }

    @Override
    public Page<User> findAllWithFilters(Specification<User> spec, Pageable pageable) {
        return userRepository.findAll(spec, pageable);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    private void sendVerificationEmail(User user) {
        VerificationCode verificationCode = new VerificationCode(user);
        user.setVerificationCode(verificationCode);
        verificationCodeRepository.save(verificationCode);

        SendWelcomeEmailJob sendWelcomeEmailJob = new SendWelcomeEmailJob(user.getId());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        BackgroundJobRequest.enqueue(sendWelcomeEmailJob);
    }

    @Override
    @Transactional
    public void verifyEmail(String code) {
        VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
                .orElseThrow(() -> ApiException.builder().status(HttpServletResponse.SC_BAD_REQUEST).message("Invalid token").build());
        User user = verificationCode.getUser();
        user.setVerified(true);
        userRepository.save(user);
        verificationCodeRepository.delete(verificationCode);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.builder().status(HttpServletResponse.SC_NOT_FOUND).message("User not found").build());
        PasswordResetToken passwordResetToken = new PasswordResetToken(user);
        passwordResetTokenRepository.save(passwordResetToken);
        SendResetPasswordEmailJob sendResetPasswordEmailJob = new SendResetPasswordEmailJob(passwordResetToken.getId());
        BackgroundJobRequest.enqueue(sendResetPasswordEmailJob);
    }

    @Override
    @Transactional
    public void resetPassword(UpdateUserPasswordRequestDto request) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(request.getPasswordResetToken())
                .orElseThrow(() -> ApiException.builder().status(HttpServletResponse.SC_NOT_FOUND).message("Password reset token not found").build());

        if (passwordResetToken.isExpired()) {
            throw ApiException.builder().status(HttpServletResponse.SC_BAD_REQUEST).message("Password reset token is expired").build();
        }

        User user = passwordResetToken.getUser();
        user.updatePassword(request.getPassword());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(UpdateUserRequestDto request, User user) {
        user.updateUserInfo(request);
        user = userRepository.save(user);
        return new UserResponseDto(user);
    }

    @Override
    public void updateUserName(String username, User user) {
        user.setUsername(username);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponseDto updatePassword(UpdateUserPasswordRequestDto request, User user) {
        if (user.getPassword() != null && !passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw ApiException.builder().status(HttpServletResponse.SC_BAD_REQUEST).message("Wrong password").build();
        }

        user.updatePassword(request.getPassword());
        user = userRepository.save(user);
        return new UserResponseDto(user);
    }

}
