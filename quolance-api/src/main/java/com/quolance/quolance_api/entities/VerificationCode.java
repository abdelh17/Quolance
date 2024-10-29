package com.quolance.quolance_api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.apache.commons.lang3.RandomStringUtils;

@Entity
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "verification_codes")
public class VerificationCode extends AbstractEntity {

    @Column(nullable = false, length = 6)
    private String code;

    @Column(nullable = false)
    private boolean emailSent = false;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public VerificationCode(User user) {
        this.user = user;
        this.code = RandomStringUtils.random(6, false, true);
    }
}
