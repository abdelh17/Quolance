package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    /**
     * Finds all messages by a specific sender.
     *
     * @param sender The sender's username.
     * @return A list of messages from the specified sender.
     */
    List<MessageEntity> findBySender(String sender);

    /**
     * Finds all messages of a specific type.
     *
     * @param messageType The type of the message (e.g., "chat", "notification").
     * @return A list of messages of the specified type.
     */
    List<MessageEntity> findByMessageType(String messageType);
}
