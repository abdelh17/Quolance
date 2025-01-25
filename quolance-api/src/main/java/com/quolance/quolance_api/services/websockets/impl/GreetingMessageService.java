package com.quolance.quolance_api.services.websockets.impl;

import com.quolance.quolance_api.entities.MessageEntity;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.MessageRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class GreetingMessageService extends AbstractWebSocketService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public GreetingMessageService(UserRepository userRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    @Override
    public boolean supports(String messageType) {
        return "GREETING".equalsIgnoreCase(messageType);
    }

    @Override
    public void processMessage(MessageEntity message, String userName) {
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new IllegalArgumentException("User not found for username: " + userName));

        if (message.getSender() == null || message.getSender().isEmpty()) {
            message.setSender(user.getUserEmail());
        }

        message.setMessageType("GREETING");
        messageRepository.save(message);

        log.debug("Greeting message saved: {}", message);
    }
}
