package com.quolance.quolance_api.services.chat.impl;

import com.quolance.quolance_api.dtos.chat.MessageDto;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.Message;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.repositories.MessageRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.chat.ChatService;
import com.quolance.quolance_api.util.exceptions.ApiException;
import com.quolance.quolance_api.util.FeatureToggle;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


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

        // Check if roles match the constraint (freelancer can only message client and vice versa)
        validateRolesForMessaging(sender, receiver);

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(sendMessageDto.getContent());

        Message savedMessage = messageRepository.save(message);
        log.info("Message sent from user {} to user {}", sender.getId(), receiver.getId());

        return MessageDto.fromEntity(savedMessage);
    }

    @Override
    public List<MessageDto> getMessagesBetweenUsers(UUID otherUserId, User currentUser) {
        if (!featureToggle.isEnabled("enableChatSystem")) {
            log.info("Chat system is currently disabled");
            throw new ApiException("Chat feature is currently disabled", 403, null);
        }

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ApiException("User not found", 404, null));

        // Check if roles match the constraint before allowing message retrieval
        validateRolesForMessaging(currentUser, otherUser);

        List<Message> messages = messageRepository.findMessagesBetweenUsers(currentUser, otherUser);
        log.info("Retrieved {} messages between users {} and {}",
                messages.size(), currentUser.getId(), otherUser.getId());

        return messages.stream()
                .map(MessageDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Validates that the users can message each other based on their roles:
     * - A FREELANCER can only message a CLIENT
     * - A CLIENT can only message a FREELANCER
     * - ADMIN users can message anyone
     *
     * @param user1 First user (typically the sender or current user)
     * @param user2 Second user (typically the receiver or the other user)
     * @throws ApiException if the role constraint is violated
     */
    private void validateRolesForMessaging(User user1, User user2) {
        // Admin can message anyone
        if (user1.getRole() == Role.ADMIN) {
            return;
        }

        // Check role constraints
        boolean isValidCommunication =
                (user1.getRole() == Role.FREELANCER && user2.getRole() == Role.CLIENT) ||
                        (user1.getRole() == Role.CLIENT && user2.getRole() == Role.FREELANCER);

        if (!isValidCommunication) {
            log.warn("Invalid messaging attempt: {} (role: {}) tried to message {} (role: {})",
                    user1.getId(), user1.getRole(), user2.getId(), user2.getRole());
            throw new ApiException("You can only exchange messages with users of complementary roles " +
                    "(freelancers can message clients and clients can message freelancers)", 403, null);
        }
    }
}