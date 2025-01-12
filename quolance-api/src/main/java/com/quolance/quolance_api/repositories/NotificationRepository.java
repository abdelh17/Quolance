package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.Notification;
import com.quolance.quolance_api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientAndRead(User recipient, boolean read);

    List<Notification> findByRecipient(User recipient);

    List<Notification> findByRecipientId(Long userId);
}
