package com.quolance.quolance_api.unit.jobs;

import com.quolance.quolance_api.configs.ApplicationProperties;
import com.quolance.quolance_api.entities.PasswordResetToken;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.jobs.SendResetPasswordEmailJob;
import com.quolance.quolance_api.jobs.handlers.SendResetPasswordEmailJobHandler;
import com.quolance.quolance_api.repositories.PasswordResetTokenRepository;
import com.quolance.quolance_api.services.auth.impl.EmailServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SendResetPasswordEmailUnitTest {

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailServiceImpl emailService;

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private SpringTemplateEngine templateEngine;

    @InjectMocks
    private SendResetPasswordEmailJobHandler jobHandler;

    @Captor
    private ArgumentCaptor<Context> contextCaptor;

    private User mockUser;
    private PasswordResetToken mockToken;
    private SendResetPasswordEmailJob mockJob;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setFirstName("Test");
        mockUser.setLastName("User");

        mockToken = new PasswordResetToken(mockUser);
        mockToken.setId(1L);

        mockJob = new SendResetPasswordEmailJob(1L);
    }

    @Test
    void run_WithValidToken_SendsEmail() throws Exception {
        String baseUrl = "http://localhost:8080";
        String expectedLink = baseUrl + "/auth/reset-password?token=" + mockToken.getToken();
        String expectedHtmlBody = "<html>Test email body</html>";

        when(passwordResetTokenRepository.findById(1L)).thenReturn(Optional.of(mockToken));
        when(applicationProperties.getBaseUrl()).thenReturn(baseUrl);
        when(templateEngine.process(eq("password-reset"), any(Context.class))).thenReturn(expectedHtmlBody);

        jobHandler.run(mockJob);

        verify(templateEngine).process(eq("password-reset"), contextCaptor.capture());
        Context capturedContext = contextCaptor.getValue();
        assertThat(capturedContext.getVariable("user")).isEqualTo(mockUser);
        assertThat(capturedContext.getVariable("link")).isEqualTo(expectedLink);

        verify(emailService).sendHtmlMessage(
                List.of(mockUser.getEmail()),
                "Password reset requested",
                expectedHtmlBody
        );

        assertThat(mockToken.isEmailSent()).isTrue();
        verify(passwordResetTokenRepository).save(mockToken);
    }

    @Test
    void run_WithNonExistentToken_ThrowsException() {
        when(passwordResetTokenRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobHandler.run(mockJob))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Token not found");

        verify(emailService, never()).sendHtmlMessage(any(), any(), any());
        verify(passwordResetTokenRepository, never()).save(any());
    }

    @Test
    void run_WithAlreadySentEmail_DoesNothing() throws Exception {
        mockToken.onEmailSent();
        when(passwordResetTokenRepository.findById(1L)).thenReturn(Optional.of(mockToken));

        jobHandler.run(mockJob);

        verify(emailService, never()).sendHtmlMessage(any(), any(), any());
        verify(passwordResetTokenRepository, never()).save(any());
    }

    @Test
    void run_WithEmailServiceFailure_PropagatesException() {
        when(passwordResetTokenRepository.findById(1L)).thenReturn(Optional.of(mockToken));
        when(applicationProperties.getBaseUrl()).thenReturn("http://localhost:8080");
        when(templateEngine.process(eq("password-reset"), any(Context.class))).thenReturn("<html></html>");
        doThrow(new RuntimeException("Email service failed"))
                .when(emailService).sendHtmlMessage(any(), any(), any());

        assertThatThrownBy(() -> jobHandler.run(mockJob))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email service failed");

        assertThat(mockToken.isEmailSent()).isFalse();
        verify(passwordResetTokenRepository, never()).save(any());
    }
}