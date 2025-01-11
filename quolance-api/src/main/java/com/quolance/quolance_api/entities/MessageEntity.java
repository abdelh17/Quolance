package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "messages")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String messageType;

    /**
     * Convenience constructor for creating a MessageEntity.
     *
     * @param message     The message content.
     * @param sender      The sender.
     * @param timestamp   The timestamp of the message.
     * @param messageType The type of the message (e.g., "chat", "notification").
     */
    public MessageEntity(String message, String sender, LocalDateTime timestamp, String messageType) {
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
        this.messageType = messageType;
    }
}
