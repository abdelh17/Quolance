package com.quolance.quolance_api.services.auth;

import com.quolance.quolance_api.entities.VerificationCode;

public interface VerificationCodeService {

    VerificationCode createVerificationCode(VerificationCode verificationCode);

    VerificationCode findByCode(String code);

    boolean updateVerificationCodeStatus(VerificationCode verificationCode);
}
