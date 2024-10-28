package com.quolance.quolance_api.jobs.handlers;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.services.EmailService;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.jobs.SendWelcomeEmailJob;
import java.util.List;

import com.quolance.quolance_api.services.UserService;
import com.quolance.quolance_api.services.VerificationCodeService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

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
    User user = userService.findById(sendWelcomEmailJob.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
    log.info("Sending welcome email to user with id: {}", sendWelcomEmailJob.getUserId());
    if (user.getVerificationCode() != null && !user.getVerificationCode().isEmailSent()) {
      sendWelcomeEmail(user, user.getVerificationCode());
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
    verificationCodeService.UpdateVerficiationCodeStatus(code);
  }
}