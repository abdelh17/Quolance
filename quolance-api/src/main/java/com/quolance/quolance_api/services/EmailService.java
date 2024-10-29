package com.quolance.quolance_api.services;

import jakarta.mail.MessagingException;

import java.util.List;

public interface EmailService {

    void sendHtmlMessage(List<String> to, String subject, String htmlBody) throws MessagingException;

    void sendSimpleEmail(List<String> to, String subject, String content);
}
