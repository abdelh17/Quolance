package com.quolance.quolance_api.services.websockets;

import com.quolance.quolance_api.entities.MessageEntity;

public interface WebSocketService {
    boolean supports(String messageType);

    void processMessage(MessageEntity message, String userEmail);

    void sendMessageToUser(String destination, Object payload);
}
