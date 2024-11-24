package com.quolance.quolance_api.jobs.handlers;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.jobs.SendTempPasswordEmailJob;
import com.quolance.quolance_api.services.auth.EmailService;
import com.quolance.quolance_api.services.entity_services.UserService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class SendTempPasswordEmailJobHandler implements JobRequestHandler<SendTempPasswordEmailJob> {

    private final UserService userService;
    private final EmailService emailService;
    private final SpringTemplateEngine templateEngine;
    private final ApplicationProperties applicationProperties;

    @Override
    public void run(SendTempPasswordEmailJob job) throws Exception {
        User user = userService.findById(job.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        sendTempPasswordEmail(user, job.getTempPassword());
        log.info("Temporary password email sent to user with id: {}", job.getUserId());
    }

    private void sendTempPasswordEmail(User user, String tempPassword) throws MessagingException {
        // Prepare email content
        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("user", user);
        thymeleafContext.setVariable("generatedPassword", tempPassword);
        thymeleafContext.setVariable("applicationName", applicationProperties.getApplicationName());

        // Generate email body using the template
        String htmlBody = templateEngine.process("generated-password-email", thymeleafContext);

        // Send the email
        String subject = "Your Temporary Password for " + applicationProperties.getApplicationName();
        emailService.sendHtmlMessage(List.of(user.getEmail()), subject, htmlBody);
    }
}
