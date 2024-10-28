package com.quolance.quolance_api.services;

import com.quolance.quolance_api.entities.VerificationCode;

import java.util.Optional;

public interface VerificationCodeService {

    VerificationCode createVerificationCode(VerificationCode verificationCode);

    Optional<VerificationCode> findByCode(String code);

    boolean updateVerificationCodeStatus(VerificationCode verificationCode);
}
