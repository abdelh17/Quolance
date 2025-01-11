package com.quolance.quolance_api.services.websockets.impl;

import com.quolance.quolance_api.services.websockets.WebSocketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractWebSocketService implements WebSocketService {
    protected final Logger log = LoggerFactory.getLogger(getClass());

    @Override
    public void sendMessageToUser(String destination, Object payload) {
        log.info("Sending message to destination: {}", destination);
        // Logic for sending messages (e.g., using SimpMessagingTemplate)
    }
}
