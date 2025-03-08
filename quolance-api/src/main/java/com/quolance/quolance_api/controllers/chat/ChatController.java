package com.quolance.quolance_api.controllers;

import com.quolance.quolance_api.dtos.chat.MessageDto;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.dtos.paging.PageResponseDto;
import com.quolance.quolance_api.dtos.paging.PageableRequestDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.services.ChatService;
import com.quolance.quolance_api.util.PaginationUtils;
import com.quolance.quolance_api.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final PaginationUtils paginationUtils;

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
    public ResponseEntity<PageResponseDto<MessageDto>> getMessagesBetweenUsers(
            @PathVariable UUID userId,
            @Valid PageableRequestDto pageableRequest) {
        User currentUser = SecurityUtil.getAuthenticatedUser();
        log.info("User with ID {} getting messages with user ID {}", currentUser.getId(), userId);
        PageResponseDto<MessageDto> messages = new PageResponseDto<>(
                chatService.getMessagesBetweenUsers(userId, currentUser, paginationUtils.createPageable(pageableRequest))
        );
        return ResponseEntity.ok(messages);
    }
}