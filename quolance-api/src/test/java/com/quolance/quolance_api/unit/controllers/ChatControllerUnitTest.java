package com.quolance.quolance_api.unit.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.QuolanceApiApplication;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.helpers.integration.NoOpNotificationConfig;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.MessageRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.chat.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = QuolanceApiApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ContextConfiguration(classes = {NoOpNotificationConfig.class})
public class ChatControllerUnitTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatService chatService;


    private User sender;
    private User receiver;
    private String senderToken;

    @BeforeEach
    void setUp() throws Exception {
        // Clear repositories before each test
        messageRepository.deleteAll();
        userRepository.deleteAll();

        // Create and save test users
        sender = EntityCreationHelper.createClient();
        receiver = EntityCreationHelper.createFreelancer(1);
        userRepository.save(sender);
        userRepository.save(receiver);

        session = sessionCreationHelper.getSession(sender.getUsername(), "Password123!");

    }


    @Test
    void sendMessageSuccessfully() throws Exception {
        // Arrange
        SendMessageDto sendMessageDto = new SendMessageDto(receiver.getId(), "Hello, how are you?");
        String requestBody = objectMapper.writeValueAsString(sendMessageDto);

        // Act & Assert
        mockMvc.perform(post("/api/chat/send")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void sendMessageWithInvalidReceiverReturnsError() throws Exception {
        // Arrange
        SendMessageDto sendMessageDto = new SendMessageDto(UUID.randomUUID(), "Hello!");
        String requestBody = objectMapper.writeValueAsString(sendMessageDto);

        // Act & Assert
        mockMvc.perform(post("/api/chat/send")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound());
    }

    @Test
    void getChatHistorySuccessfully() throws Exception {
        // Arrange
        messageRepository.save(EntityCreationHelper.createMessage(sender, receiver, "Message 1"));
        messageRepository.save(EntityCreationHelper.createMessage(receiver, sender, "Message 2"));

        // Act & Assert
        String response = mockMvc.perform(get("/api/chat/messages/" + receiver.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
        assertThat(jsonNode).hasSize(2);
        assertThat(jsonNode.get(0).get("content").asText()).isEqualTo("Message 2");
        assertThat(jsonNode.get(1).get("content").asText()).isEqualTo("Message 1");
    }

    @Test
    void getChatHistoryWithInvalidUserReturnsError() throws Exception {
        // Act & Assert
        String response = mockMvc.perform(get("/api/chat/messages/" + UUID.randomUUID())
                        .session(session))
                .andExpect(status().isNotFound())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode jsonNode = objectMapper.readTree(response);
    }

    @Test
    void getContactsWhenNoMessagesReturnsEmptyList() throws Exception {
        // Act
        String response = mockMvc.perform(get("/api/chat/contacts")
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        JsonNode jsonNode = objectMapper.readTree(response);
        assertThat(jsonNode).isEmpty();
    }

    @Test
    void sendMessageWithoutSessionReturnsUnauthorized() throws Exception {
        // Arrange
        SendMessageDto sendMessageDto = new SendMessageDto(receiver.getId(), "Hello!");
        String requestBody = objectMapper.writeValueAsString(sendMessageDto);

        // Act & Assert
        mockMvc.perform(post("/api/chat/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getMessagesWithoutSessionReturnsUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/chat/messages/" + receiver.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void sendMessageWithNullContentReturnsError() throws Exception {
        // Arrange
        SendMessageDto sendMessageDto = new SendMessageDto(receiver.getId(), null);
        String requestBody = objectMapper.writeValueAsString(sendMessageDto);

        // Act & Assert
        mockMvc.perform(post("/api/chat/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void sendMessageWithInvalidJsonReturnsError() throws Exception {
        // Arrange
        String invalidJson = "{ \"receiverId\": \"invalid-uuid\", \"content\": \"Hello!\" }";

        // Act & Assert
        mockMvc.perform(post("/api/chat/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getMessagesWithInvalidUserIdFormatReturnsError() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/chat/messages/invalid-uuid"))
                .andExpect(status().isUnauthorized());
    }


    @Test
    void sendMessageWithEmptyRequestBodyReturnsError() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/chat/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }
}