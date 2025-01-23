package com.quolance.quolance_api.util.websockets;

import com.quolance.quolance_api.entities.MessageEntity;
import com.quolance.quolance_api.services.websockets.WebSocketService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebSocketServiceLocator {

    private final List<WebSocketService> services;

    public WebSocketServiceLocator(List<WebSocketService> services) {
        this.services = services;
    }

    public WebSocketService getService(String messageType) {
        return services.stream()
                .filter(service -> service.supports(messageType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No handler found for message type: " + messageType));
    }

    public void processMessage(MessageEntity message, String userName) {
        WebSocketService service = getService(message.getMessageType());
        service.processMessage(message, userName);
    }
}
