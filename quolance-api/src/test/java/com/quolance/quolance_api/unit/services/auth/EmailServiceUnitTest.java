package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.util.exceptions.ApiException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

    @Mock
    private JavaMailSender emailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailServiceImpl emailService;

    @BeforeEach
    void setUp() {
        lenient().when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void sendHtmlMessage_Success() throws Exception {
        List<String> recipients = List.of("test@example.com");
        String subject = "Test Subject";
        String htmlBody = "<h1>Test Email</h1>";

        emailService.sendHtmlMessage(recipients, subject, htmlBody);

        verify(emailSender).createMimeMessage();
        verify(emailSender).send(mimeMessage);
    }

//    @Test
//    void sendHtmlMessage_ThrowsException() throws Exception {
//        List<String> recipients = List.of("test@example.com");
//        String subject = "Test Subject";
//        String htmlBody = "<h1>Test Email</h1>";
//
//        doThrow(new MessagingException("Failed to send email"))
//                .when(emailSender).send(any(MimeMessage.class));
//
//        ApiException exception = assertThrows(ApiException.class, () ->
//                emailService.sendHtmlMessage(recipients, subject, htmlBody)
//        );
//
//        verify(emailSender).createMimeMessage();
//        verify(emailSender).send(any(MimeMessage.class));
//        assert exception.getMessage().contains("Error sending email");
//    }

    @Test
    void sendSimpleEmail_Success() {
        List<String> recipients = List.of("test@example.com");
        String subject = "Test Subject";
        String content = "This is a simple test email.";

        emailService.sendSimpleEmail(recipients, subject, content);

        verify(emailSender).send(any(SimpleMailMessage.class));
    }
}
