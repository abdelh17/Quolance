package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.jobs.SendWelcomeEmailJob;
import com.quolance.quolance_api.repositories.VerificationCodeRepository;
import com.quolance.quolance_api.services.auth.VerificationCodeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
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

    @Override
    public boolean deleteVerificationCode(VerificationCode verificationCode) {
        verificationCodeRepository.delete(verificationCode);
        return true;
    }

    @Override
    public void sendVerificationCode(User user) {
        VerificationCode verificationCode = new VerificationCode(user);
        user.setVerificationCode(verificationCode);
        verificationCodeRepository.save(verificationCode);

        SendWelcomeEmailJob sendWelcomeEmailJob = new SendWelcomeEmailJob(user.getId());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            log.warn("Thread interrupted while waiting to send welcome email for user ID: {}", user.getId(), e);
            Thread.currentThread().interrupt();
        }
        log.debug("Enqueueing welcome email job for user ID: {}", user.getId());
        BackgroundJobRequest.enqueue(sendWelcomeEmailJob);    }

}
