package com.quolance.quolance_api.services.auth.impl;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.repositories.VerificationCodeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VerificationCodeServiceUnitTest {

    @Mock
    private VerificationCodeRepository verificationCodeRepository;

    @InjectMocks
    private VerificationCodeServiceImpl verificationCodeService;

    private VerificationCode mockVerificationCode;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .build();

        mockVerificationCode = new VerificationCode();
        mockVerificationCode.setCode("123456");
        mockVerificationCode.setUser(mockUser);
    }

    @Test
    void createVerificationCode_Success() {
        when(verificationCodeRepository.save(any(VerificationCode.class))).thenReturn(mockVerificationCode);

        VerificationCode result = verificationCodeService.createVerificationCode(mockVerificationCode);

        assertThat(result).isNotNull();
        assertThat(result.getCode()).isEqualTo(mockVerificationCode.getCode());
        verify(verificationCodeRepository).save(mockVerificationCode);
    }

    @Test
    void findByCode_Success() {
        when(verificationCodeRepository.findByCode(mockVerificationCode.getCode()))
                .thenReturn(Optional.of(mockVerificationCode));

        Optional<VerificationCode> result = verificationCodeService.findByCode(mockVerificationCode.getCode());

        assertThat(result).isPresent();
        assertThat(result.get().getCode()).isEqualTo(mockVerificationCode.getCode());
        verify(verificationCodeRepository).findByCode(mockVerificationCode.getCode());
    }

    @Test
    void findByCode_NotFound() {
        String code = "nonexistent";
        when(verificationCodeRepository.findByCode(code)).thenReturn(Optional.empty());

        Optional<VerificationCode> result = verificationCodeService.findByCode(code);

        assertThat(result).isEmpty();
        verify(verificationCodeRepository).findByCode(code);
    }

    @Test
    void updateVerificationCodeStatus_Success() {
        when(verificationCodeRepository.save(mockVerificationCode)).thenReturn(mockVerificationCode);

        boolean result = verificationCodeService.updateVerificationCodeStatus(mockVerificationCode);

        assertThat(result).isTrue();
        verify(verificationCodeRepository).save(mockVerificationCode);
    }

    @Test
    void updateVerificationCodeStatus_Failure() {
        when(verificationCodeRepository.save(mockVerificationCode)).thenReturn(null);

        boolean result = verificationCodeService.updateVerificationCodeStatus(mockVerificationCode);

        assertThat(result).isFalse();
        verify(verificationCodeRepository).save(mockVerificationCode);
    }
}