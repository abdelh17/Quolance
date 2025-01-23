package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_token")
@Getter
@NoArgsConstructor
public class PasswordResetToken extends AbstractEntity {

    private String token;
    private boolean emailSent = false;
    private LocalDateTime expiresAt;

    @ManyToOne
    private User user;

    public PasswordResetToken(User user) {
        this.user = user;
        this.token = RandomStringUtils.random(6, false, true);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void onEmailSent() {
        this.emailSent = true;
        this.expiresAt = LocalDateTime.now().plusMinutes(10);
    }
}
