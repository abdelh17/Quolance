package com.quolance.quolance_api.integration.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quolance.quolance_api.QuolanceApiApplication;
import com.quolance.quolance_api.dtos.chat.SendMessageDto;
import com.quolance.quolance_api.entities.Message;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.helpers.integration.EntityCreationHelper;
import com.quolance.quolance_api.helpers.integration.NoOpNotificationConfig;
import com.quolance.quolance_api.integration.BaseIntegrationTest;
import com.quolance.quolance_api.repositories.MessageRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = QuolanceApiApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ContextConfiguration(classes = {NoOpNotificationConfig.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ChatControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    private User sender;
    private User receiver;
    private MockHttpSession session;

    @BeforeEach
    void setUp() throws Exception {

        messageRepository.deleteAll();
        userRepository.deleteAll();

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

        // Act
        mockMvc.perform(post("/api/chat/send")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());

        // Assert
        List<Message> messages = messageRepository.findAll();
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello, how are you?");
        assertThat(messages.get(0).getSender().getId()).isEqualTo(sender.getId());
        assertThat(messages.get(0).getReceiver().getId()).isEqualTo(receiver.getId());
    }

    @Test
    void sendMessageWithInvalidReceiverReturnsError() throws Exception {
        // Arrange
        SendMessageDto sendMessageDto = new SendMessageDto(UUID.randomUUID(), "Hello!");
        String requestBody = objectMapper.writeValueAsString(sendMessageDto);

        // Act
        mockMvc.perform(post("/api/chat/send")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound());

        // Assert
        assertThat(messageRepository.findAll()).isEmpty();
    }

    @Test
    void getChatHistorySuccessfully() throws Exception {
        // Arrange
        messageRepository.save(EntityCreationHelper.createMessage(sender, receiver, "Message 1"));
        messageRepository.save(EntityCreationHelper.createMessage(receiver, sender, "Message 2"));

        // Act
        String response = mockMvc.perform(get("/api/chat/messages/" + receiver.getId())
                        .session(session))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert
        JsonNode jsonNode = objectMapper.readTree(response);
        assertThat(jsonNode).hasSize(2);
        assertThat(jsonNode.get(0).get("content").asText()).isEqualTo("Message 2");
        assertThat(jsonNode.get(1).get("content").asText()).isEqualTo("Message 1");

        // Verify repository state
        List<Message> messages = messageRepository.findAll();
        assertThat(messages).hasSize(2);
    }

    @Test
    void getChatHistoryWithInvalidUserReturnsError() throws Exception {
        // Act
        mockMvc.perform(get("/api/chat/messages/" + UUID.randomUUID())
                        .session(session))
                .andExpect(status().isNotFound());

        // Assert
        assertThat(messageRepository.findAll()).isEmpty();
    }



}