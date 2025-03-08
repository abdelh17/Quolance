package com.quolance.quolance_api.services.impl;

import com.quolance.quolance_api.dtos.chat.MessageDto;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.Message;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.MessageRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.ChatService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import com.quolance.quolance_api.util.FeatureToggle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of the ChatService interface
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FeatureToggle featureToggle;

    @Override
    @Transactional
    public MessageDto sendMessage(SendMessageDto sendMessageDto, User sender) {
        if (!featureToggle.isEnabled("enableChatSystem")) {
            log.info("Chat system is currently disabled");
            throw new ApiException("Chat feature is currently disabled", 403, null);
        }

        User receiver = userRepository.findById(sendMessageDto.getReceiverId())
                .orElseThrow(() -> new ApiException("Receiver not found", 404, null));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(sendMessageDto.getContent());

        Message savedMessage = messageRepository.save(message);
        log.info("Message sent from user {} to user {}", sender.getId(), receiver.getId());

        return MessageDto.fromEntity(savedMessage);
    }

    @Override
    public Page<MessageDto> getMessagesBetweenUsers(UUID otherUserId, User currentUser, Pageable pageable) {
        if (!featureToggle.isEnabled("enableChatSystem")) {
            log.info("Chat system is currently disabled");
            throw new ApiException("Chat feature is currently disabled", 403, null);
        }

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ApiException("User not found", 404, null));

        Page<Message> messages = messageRepository.findMessagesBetweenUsers(currentUser, otherUser, pageable);
        log.info("Retrieved {} messages between users {} and {}",
                messages.getTotalElements(), currentUser.getId(), otherUser.getId());

        return messages.map(MessageDto::fromEntity);
    }
}