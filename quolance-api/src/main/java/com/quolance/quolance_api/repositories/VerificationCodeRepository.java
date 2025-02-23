package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, UUID> {

    VerificationCode save(VerificationCode verificationCode);

    VerificationCode findByCode(String code);
}
