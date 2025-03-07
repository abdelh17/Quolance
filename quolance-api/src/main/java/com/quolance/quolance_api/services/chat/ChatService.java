package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.chat.MessageDto;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Service interface for chat functionality
 */
public interface ChatService {

    /**
     * Send a message from one user to another
     *
     * @param sendMessageDto DTO containing recipient and message content
     * @param sender The user sending the message
     * @return DTO of the created message
     */
    MessageDto sendMessage(SendMessageDto sendMessageDto, User sender);

    /**
     * Get messages between two users with pagination
     *
     * @param otherUserId ID of the other user in the conversation
     * @param currentUser The current authenticated user
     * @param pageable Pagination information
     * @return Page of message DTOs
     */
    Page<MessageDto> getMessagesBetweenUsers(UUID otherUserId, User currentUser, Pageable pageable);
}