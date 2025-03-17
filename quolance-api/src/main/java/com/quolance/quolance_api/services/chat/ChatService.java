package com.quolance.quolance_api.services;

import com.quolance.quolance_api.dtos.chat.MessageDto;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.User;

import java.util.List;
import java.util.UUID;


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
     * Get messages between two users
     *
     * @param otherUserId ID of the other user in the conversation
     * @param currentUser The current authenticated user
     * @return List of message DTOs
     */
    List<MessageDto> getMessagesBetweenUsers(UUID otherUserId, User currentUser);
}