package com.quolance.quolance_api.unit.jobs;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.jobs.SendTempPasswordEmailJob;
import com.quolance.quolance_api.jobs.handlers.SendTempPasswordEmailJobHandler;
import com.quolance.quolance_api.services.auth.EmailService;
import com.quolance.quolance_api.services.entity_services.UserService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.context.Context;
import org.thymeleaf.context.IContext;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SendTempPasswordEmailUnitTest {

    private static final String TEMP_PASSWORD = "temp123";
    private static final String APP_NAME = "Quolance";
    @Mock
    private UserService userService;
    @Mock
    private EmailService emailService;
    @Mock
    private SpringTemplateEngine templateEngine;
    @Mock
    private ApplicationProperties applicationProperties;
    @InjectMocks
    private SendTempPasswordEmailJobHandler jobHandler;
    @Captor
    private ArgumentCaptor<Context> contextCaptor;
    private User mockUser;
    private SendTempPasswordEmailJob mockJob;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("test@example.com");
        mockUser.setFirstName("Test");
        mockUser.setLastName("User");

        mockJob = new SendTempPasswordEmailJob(mockUser.getId(), TEMP_PASSWORD);
    }

    @Test
    void run_WithValidUser_SendsEmail() throws Exception {
        String expectedHtmlBody = "<html>Test email body</html>";

        when(userService.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        when(applicationProperties.getApplicationName()).thenReturn(APP_NAME);
        when(templateEngine.process(eq("generated-password-email"), any(IContext.class))).thenReturn(expectedHtmlBody);

        jobHandler.run(mockJob);

        verify(templateEngine).process(eq("generated-password-email"), contextCaptor.capture());
        Context capturedContext = contextCaptor.getValue();
        assertThat(capturedContext.getVariable("user")).isEqualTo(mockUser);
        assertThat(capturedContext.getVariable("generatedPassword")).isEqualTo(TEMP_PASSWORD);
        assertThat(capturedContext.getVariable("applicationName")).isEqualTo(APP_NAME);

        verify(emailService).sendHtmlMessage(
                List.of(mockUser.getEmail()),
                "Your Temporary Password for " + APP_NAME,
                expectedHtmlBody
        );
    }

    @Test
    void run_WithNonExistentUser_ThrowsException() throws MessagingException {
        when(userService.findById(mockJob.getUserId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobHandler.run(mockJob))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");

        verify(emailService, never()).sendHtmlMessage(any(), any(), any());
        verify(templateEngine, never()).process(any(String.class), any(IContext.class));
    }

    @Test
    void run_WithTemplateEngineFailure_PropagatesException() throws MessagingException {
        when(userService.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        when(applicationProperties.getApplicationName()).thenReturn(APP_NAME);
        when(templateEngine.process(eq("generated-password-email"), any(IContext.class)))
                .thenThrow(new RuntimeException("Template processing failed"));

        assertThatThrownBy(() -> jobHandler.run(mockJob))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Template processing failed");

        verify(emailService, never()).sendHtmlMessage(any(), any(), any());
    }

    @Test
    void run_WithEmailServiceFailure_PropagatesException() throws MessagingException {
        when(userService.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        when(applicationProperties.getApplicationName()).thenReturn(APP_NAME);
        when(templateEngine.process(eq("generated-password-email"), any(IContext.class))).thenReturn("<html></html>");
        doThrow(new RuntimeException("Email service failed"))
                .when(emailService).sendHtmlMessage(any(), any(), any());

        assertThatThrownBy(() -> jobHandler.run(mockJob))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email service failed");

        verify(templateEngine).process(eq("generated-password-email"), any(IContext.class));
    }

    @Test
    void run_WithInvalidEmailAddress_ThrowsException() throws MessagingException {
        String invalidEmail = "invalid-email";
        mockUser.setEmail(invalidEmail);

        when(userService.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        when(applicationProperties.getApplicationName()).thenReturn(APP_NAME);
        when(templateEngine.process(eq("generated-password-email"), any(IContext.class))).thenReturn("<html></html>");
        doThrow(new MessagingException("Invalid email address"))
                .when(emailService).sendHtmlMessage(any(), any(), any());

        assertThatThrownBy(() -> jobHandler.run(mockJob))
                .isInstanceOf(MessagingException.class)
                .hasMessage("Invalid email address");

        verify(templateEngine).process(eq("generated-password-email"), any(IContext.class));
    }
}