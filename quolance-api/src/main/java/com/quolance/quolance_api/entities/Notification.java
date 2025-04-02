package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;

@Entity
@SuperBuilder
@NoArgsConstructor
@Getter
@Setter
@Table(name = "notifications")
public class Notification extends AbstractEntity {

    @Length(max = 500)
    @Column(nullable = false,length = 500)
    private String message;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Column(nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    /**
     * Convenience constructor for creating a Notification.
     *
     * @param message   The content of the notification.
     * @param sender    The user who sent the notification.
     * @param recipient The user who receives the notification.
     */
    public Notification(String message, User sender, User recipient) {
        this.message = message;
        this.sender = sender;
        this.recipient = recipient;
        this.timestamp = LocalDateTime.now();
        this.read = false;
    }

    /**
     * Marks the notification as read.
     */
    public void markAsRead() {
        this.read = true;
    }
}
