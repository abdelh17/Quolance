package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.websocket.ChatResponseDto;
import com.quolance.quolance_api.dtos.websocket.GreetingResponseDto;
import com.quolance.quolance_api.dtos.websocket.NotificationResponseDto;
import com.quolance.quolance_api.entities.MessageEntity;
import com.quolance.quolance_api.entities.enums.MessageType;
import com.quolance.quolance_api.util.websockets.WebSocketUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketUtils webSocketUtils;

    @MessageMapping("/greet")
    @SendTo("/topic/greetings")
    public GreetingResponseDto handleGreeting(MessageEntity message, Principal principal) {
        webSocketUtils.validatePrincipal(principal);
        webSocketUtils.processMessage(message, principal, String.valueOf(MessageType.GREETING));
        return GreetingResponseDto.from(
                "Hello, " + principal.getName() + "! You said: " + message.getMessage(),
                null
        );
    }

    @MessageMapping("/notify")
    @SendTo("/topic/notifications")
    public NotificationResponseDto handleNotification(MessageEntity message, Principal principal) {
        webSocketUtils.validatePrincipal(principal);
        webSocketUtils.processMessage(message, principal, String.valueOf(MessageType.NOTIFICATION));
        return NotificationResponseDto.from(
                "Notification: " + message.getMessage(),
                message.getTimestamp()
        );
    }

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatResponseDto handleChat(MessageEntity message, Principal principal) {
        webSocketUtils.validatePrincipal(principal);
        webSocketUtils.processMessage(message, principal, String.valueOf(MessageType.CHAT));
        return ChatResponseDto.from(
                message.getMessage(),
                message.getSender(),
                message.getTimestamp()
        );
    }
}
