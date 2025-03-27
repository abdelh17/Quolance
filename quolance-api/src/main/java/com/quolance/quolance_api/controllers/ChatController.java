package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.chat.ContactDto;
import com.quolance.quolance_api.dtos.chat.MessageDto;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.chat.ChatService;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    @Operation(summary = "Send a message", description = "Send a message to another user")
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody SendMessageDto sendMessageDto) {
        User sender = SecurityUtil.getAuthenticatedUser();
        return ResponseEntity.ok(chatService.sendMessage(sendMessageDto, sender));
    }

    @GetMapping("/messages/{userId}")
    @Operation(summary = "Get messages with user", description = "Get all messages between the current user and another user")
    public ResponseEntity<List<MessageDto>> getMessagesBetweenUsers(@PathVariable UUID userId) {
        User currentUser = SecurityUtil.getAuthenticatedUser();
        return ResponseEntity.ok(chatService.getMessagesBetweenUsers(userId, currentUser));
    }

    @GetMapping("/contacts")
    @Operation(summary = "Get user contacts", description = "Get array of all contacts with name, profile picture, user ID, and last message")
    public ResponseEntity<List<ContactDto>> getContacts() {
        User currentUser = SecurityUtil.getAuthenticatedUser();
        return ResponseEntity.ok(chatService.getContacts(currentUser));
    }
}