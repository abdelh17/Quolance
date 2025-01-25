package com.quolance.quolance_api.jobs.handlers;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.jobs.SendWelcomeEmailJob;
import com.quolance.quolance_api.services.auth.EmailService;
import com.quolance.quolance_api.services.auth.VerificationCodeService;
import com.quolance.quolance_api.services.entity_services.UserService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class SendWelcomeEmailJobHandler implements JobRequestHandler<SendWelcomeEmailJob> {

    private final UserService userService;
    private final VerificationCodeService verificationCodeService;
    private final SpringTemplateEngine templateEngine;
    private final EmailService emailService;
    private final ApplicationProperties applicationProperties;

    @Override
    @Transactional
    public void run(SendWelcomeEmailJob sendWelcomEmailJob) throws Exception {
        Long userId = sendWelcomEmailJob.getUserId();

        Thread.sleep(5000);

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerificationCode() == null) {
            return;
        }

        if (user.getVerificationCode().isEmailSent()) {
            return;
        }

        try {
            sendWelcomeEmail(user, user.getVerificationCode());
        } catch (Exception e) {
            throw e;
        }
    }

    private void sendWelcomeEmail(User user, VerificationCode code) throws MessagingException {
        String verificationLink = applicationProperties.getBaseUrl() + "/api/users/verify-email?token=" + code.getCode();
        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("user", user);
        thymeleafContext.setVariable("verificationLink", verificationLink);
        thymeleafContext.setVariable("applicationName", applicationProperties.getApplicationName());
        String htmlBody = templateEngine.process("welcome-email", thymeleafContext);
        emailService.sendHtmlMessage(List.of(user.getEmail()), "Welcome to our platform", htmlBody);
        code.setEmailSent(true);
        verificationCodeService.updateVerificationCodeStatus(code);
    }
}