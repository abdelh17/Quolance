package com.quolance.quolance_api.util.websockets;

import com.quolance.quolance_api.entities.MessageEntity;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
public class WebSocketUtils {

    private final WebSocketServiceLocator webSocketServiceLocator;

    public WebSocketUtils(WebSocketServiceLocator webSocketServiceLocator) {
        this.webSocketServiceLocator = webSocketServiceLocator;
    }

    // Validate principal to ensure user is authenticated
    public void validatePrincipal(Principal principal) {
        if (principal == null) {
            throw new SecurityException("No principal in WebSocket!");
        }
    }

    // Generic method to process messages using WebSocketServiceLocator
    public void processMessage(MessageEntity message, Principal principal, String messageType) {
        message.setMessageType(messageType);
        message.setSender(principal.getName());
        webSocketServiceLocator.processMessage(message, principal.getName());
    }
}
