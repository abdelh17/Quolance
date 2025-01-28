package com.quolance.quolance_api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "messages")
public class MessageEntity extends AbstractEntity {

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
