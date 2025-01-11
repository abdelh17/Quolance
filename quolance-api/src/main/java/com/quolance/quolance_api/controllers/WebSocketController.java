package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.configs.WebSocketConfig;
import com.quolance.quolance_api.dtos.websocket.ChatResponseDto;
import com.quolance.quolance_api.dtos.websocket.GreetingResponseDto;
import com.quolance.quolance_api.dtos.websocket.NotificationResponseDto;
import com.quolance.quolance_api.entities.MessageEntity;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.MessageType;
import com.quolance.quolance_api.repositories.MessageRepository;
import com.quolance.quolance_api.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final MessageRepository messageRepository;

    @MessageMapping("/greet")
    @SendTo("/topic/greetings")
    public GreetingResponseDto handleGreeting(MessageEntity message, Principal principal) {
        // Log the message and principal
        System.out.println("Message in Greetings: " + message.getMessage());
        System.out.println("Principal in Greetings: " + principal);

        if (principal == null) {
            throw new SecurityException("No principal in WebSocket!");
        }

        // Get the name from the Principal
        String authenticatedUserEmail = principal.getName();
        System.out.println("Principal.getName(): " + authenticatedUserEmail);

        // Set sender if not provided
        if (message.getSender() == null || message.getSender().isEmpty()) {
            message.setSender(authenticatedUserEmail);
        }

        // Set message type
        message.setMessageType(String.valueOf(MessageType.GREETING));

        // Save the message to the database (assuming messageRepository is available)
        messageRepository.save(message);

        // Create a greeting response DTO
        String responseMessage = "Hello, " + authenticatedUserEmail + "! You said: " + message.getMessage();
        return GreetingResponseDto.from(responseMessage, null);
    }


    @MessageMapping("/notify")
    @SendTo("/topic/notifications")
    public NotificationResponseDto handleNotification(MessageEntity message) {
        // Get the authenticated user
        User user = SecurityUtil.getAuthenticatedUser();

        // Set timestamp if not provided
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        // Save the notification to the database
        messageRepository.save(message);

        // Create a notification response DTO
        String notificationMessage = "Notification: " + message.getMessage();
        return NotificationResponseDto.from(notificationMessage, message.getTimestamp());
    }

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatResponseDto handleChat(MessageEntity message) {
        // Get the authenticated user
        User user = SecurityUtil.getAuthenticatedUser();

        // Set sender and timestamp if not provided
        if (message.getSender() == null || message.getSender().isEmpty()) {
            message.setSender(user.getUserEmail());
        }
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }

        // Save the chat message to the database
        messageRepository.save(message);

        // Create a chat response DTO
        String chatMessage = message.getMessage();
        return ChatResponseDto.from(chatMessage, message.getSender(), message.getTimestamp());
    }
}
