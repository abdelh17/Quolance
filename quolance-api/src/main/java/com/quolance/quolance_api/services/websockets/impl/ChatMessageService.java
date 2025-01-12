package com.quolance.quolance_api.services.websockets.impl;

import com.quolance.quolance_api.entities.MessageEntity;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageService extends AbstractWebSocketService {

    @Override
    public boolean supports(String messageType) {
        return "CHAT".equalsIgnoreCase(messageType);
    }

    @Override
    public void processMessage(MessageEntity message, String userEmail) {
        log.debug("Processing chat message from user: {}", userEmail);
        // chat-specific logic here
    }
}
