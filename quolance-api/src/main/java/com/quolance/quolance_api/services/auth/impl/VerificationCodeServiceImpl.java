package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.repositories.VerificationCodeRepository;
import com.quolance.quolance_api.services.auth.VerificationCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationCodeServiceImpl implements VerificationCodeService {

    private final VerificationCodeRepository verificationCodeRepository;

    @Override
    public VerificationCode createVerificationCode(VerificationCode verificationCode) {
        return verificationCodeRepository.save(verificationCode);
    }

    @Override
    public VerificationCode findByCode(String code) {
        return verificationCodeRepository.findByCode(code);
    }

    @Override
    public boolean updateVerificationCodeStatus(VerificationCode verificationCode) {
        return verificationCodeRepository.save(verificationCode) != null;
    }

}
