package com.quolance.quolance_api.repositories;

import com.quolance.quolance_api.entities.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    VerificationCode save(VerificationCode verificationCode);

    Optional<VerificationCode> findByCode(String code);
}
