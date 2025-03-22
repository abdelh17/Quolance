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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final ConcurrentHashMap<String, Long> lastLogTime = new ConcurrentHashMap<>();
    private static final long LOG_INTERVAL = 60000;

    @PostMapping("/send")
    @Operation(summary = "Send a message", description = "Send a message to another user")
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody SendMessageDto sendMessageDto) {
        User sender = SecurityUtil.getAuthenticatedUser();
        log.info("User {} sending message to {}", sender.getId(), sendMessageDto.getReceiverId());
        return ResponseEntity.ok(chatService.sendMessage(sendMessageDto, sender));
    }

    @GetMapping("/messages/{userId}")
    @Operation(summary = "Get messages with user", description = "Get all messages between the current user and another user")
    public ResponseEntity<List<MessageDto>> getMessagesBetweenUsers(@PathVariable UUID userId) {
        User currentUser = SecurityUtil.getAuthenticatedUser();
        String key = currentUser.getId() + "-" + userId;
        long now = System.currentTimeMillis();

        Long previous = lastLogTime.get(key);
        if (previous == null || (now - previous) > LOG_INTERVAL) {
            log.info("User {} polling messages with {}", currentUser.getId(), userId);
            lastLogTime.put(key, now);
        }

        return ResponseEntity.ok(chatService.getMessagesBetweenUsers(userId, currentUser));
    }

    @GetMapping("/contacts")
    @Operation(summary = "Get user contacts", description = "Get array of all contacts with name, profile picture, user ID, and last message")
    public ResponseEntity<List<ContactDto>> getContacts() {
        User currentUser = SecurityUtil.getAuthenticatedUser();
        String key = "contacts-" + currentUser.getId();
        long now = System.currentTimeMillis();

        Long previous = lastLogTime.get(key);
        if (previous == null || (now - previous) > LOG_INTERVAL) {
            log.info("User {} fetching contacts", currentUser.getId());
            lastLogTime.put(key, now);
        }

        return ResponseEntity.ok(chatService.getContacts(currentUser));
    }
}