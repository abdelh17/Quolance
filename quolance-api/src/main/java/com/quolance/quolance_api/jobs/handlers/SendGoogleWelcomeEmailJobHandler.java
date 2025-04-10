package com.quolance.quolance_api.jobs.handlers;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.jobs.SendGoogleWelcomeEmailJob;
import com.quolance.quolance_api.services.auth.EmailService;
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
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class SendGoogleWelcomeEmailJobHandler implements JobRequestHandler<SendGoogleWelcomeEmailJob> {
    private final UserService userService;
    private final SpringTemplateEngine templateEngine;
    private final EmailService emailService;
    private final ApplicationProperties applicationProperties;

    @Override
    @Transactional
    public void run(SendGoogleWelcomeEmailJob sendWelcomeEmailJob) throws Exception {
        UUID userId = sendWelcomeEmailJob.getUserId();

        Thread.sleep(5000);

        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            sendGoogleWelcomeEmail(user);
        } catch (Exception e) {
            throw e;
        }
    }

    private void sendGoogleWelcomeEmail(User user) throws MessagingException {
        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("user", user);
        thymeleafContext.setVariable("applicationName", applicationProperties.getApplicationName());
        thymeleafContext.setVariable("resetPasswordUrl", applicationProperties.getResetPasswordUrl());

        String htmlBody = templateEngine.process("welcome-email-google", thymeleafContext);
        String subject = "Welcome to Quolance!";

        emailService.sendHtmlMessage(List.of(user.getEmail()), subject, htmlBody);
    }
}
