package com.quolance.quolance_api.services.auth.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender emailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailServiceImpl emailService;

    private List<String> recipients;
    private String subject;
    private String content;

    @BeforeEach
    void setUp() {
        recipients = List.of("test@example.com", "test2@example.com");
        subject = "Test Subject";
        content = "Test Content";
        lenient().when(emailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void sendHtmlMessage_Success() throws MessagingException {
        String htmlBody = "<h1>Test HTML Email</h1>";
        emailService.sendHtmlMessage(recipients, subject, htmlBody);
        verify(emailSender).createMimeMessage();
        verify(emailSender).send(any(MimeMessage.class));
    }

    @Test
    void sendHtmlMessage_WithEmptyRecipientList() {
        String htmlBody = "<h1>Test HTML Email</h1>";
        assertDoesNotThrow(() -> emailService.sendHtmlMessage(Collections.emptyList(), subject, htmlBody));
    }

    @Test
    void sendHtmlMessage_WhenMailSenderFails_ThrowsRuntimeException() {
        String htmlBody = "<h1>Test HTML Email</h1>";
        RuntimeException exception = new RuntimeException("Error sending email");
        doThrow(exception).when(emailSender).send(any(MimeMessage.class));

        RuntimeException thrown = assertThrows(RuntimeException.class, () ->
                emailService.sendHtmlMessage(recipients, subject, htmlBody)
        );

        assertEquals("Error sending email", thrown.getMessage());
        verify(emailSender).createMimeMessage();
        verify(emailSender).send(any(MimeMessage.class));
    }

    @Test
    void sendSimpleEmail_Success() {
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        emailService.sendSimpleEmail(recipients, subject, content);
        verify(emailSender).send(messageCaptor.capture());
        SimpleMailMessage capturedMessage = messageCaptor.getValue();
        assertArrayEquals(recipients.toArray(new String[0]), capturedMessage.getTo());
        assertEquals(subject, capturedMessage.getSubject());
        assertEquals(content, capturedMessage.getText());
    }

    @Test
    void sendSimpleEmail_WithEmptyRecipientList() {
        assertDoesNotThrow(() -> emailService.sendSimpleEmail(Collections.emptyList(), subject, content));
        verify(emailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendSimpleEmail_WhenMailSenderFails_ThrowsException() {
        doThrow(new MailSendException("Mail server error"))
                .when(emailSender).send(any(SimpleMailMessage.class));
        assertThrows(MailSendException.class, () -> emailService.sendSimpleEmail(recipients, subject, content));
    }

    @Test
    void sendHtmlMessage_WithNullParameters() {
        String htmlBody = "<h1>Test HTML Email</h1>";
        assertThrows(NullPointerException.class, () -> emailService.sendHtmlMessage(null, subject, htmlBody));
        assertThrows(IllegalArgumentException.class, () -> emailService.sendHtmlMessage(recipients, null, htmlBody));
        assertThrows(IllegalArgumentException.class, () -> emailService.sendHtmlMessage(recipients, subject, null));
    }
}