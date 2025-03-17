package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.chat.MessageDto;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.chat.ChatService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    @Operation(
            summary = "Send a message",
            description = "Send a message to another user"
    )
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody SendMessageDto sendMessageDto) {
        User sender = SecurityUtil.getAuthenticatedUser();
        log.info("User with ID {} sending message to user with ID {}", sender.getId(), sendMessageDto.getReceiverId());
        MessageDto message = chatService.sendMessage(sendMessageDto, sender);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/messages/{userId}")
    @Operation(
            summary = "Get messages with user",
            description = "Get all messages between the current user and another user"
    )
    public ResponseEntity<List<MessageDto>> getMessagesBetweenUsers(
            @PathVariable UUID userId) {
        User currentUser = SecurityUtil.getAuthenticatedUser();
        log.info("User with ID {} getting messages with user ID {}", currentUser.getId(), userId);
        List<MessageDto> messages = chatService.getMessagesBetweenUsers(userId, currentUser);
        return ResponseEntity.ok(messages);
    }
}