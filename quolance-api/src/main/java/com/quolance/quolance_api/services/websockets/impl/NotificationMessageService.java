package com.quolance.quolance_api.services.websockets.impl;

import com.quolance.quolance_api.entities.MessageEntity;
import org.springframework.stereotype.Service;

@Service
public class NotificationMessageService extends AbstractWebSocketService {

    @Override
    public boolean supports(String messageType) {
        return "NOTIFICATION".equalsIgnoreCase(messageType);
    }

    @Override
    public void processMessage(MessageEntity message, String userEmail) {
        log.debug("Processing notification for user: {}", userEmail);
        // notification-specific logic here
    }
}