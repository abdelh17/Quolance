package com.quolance.quolance_api.unit.services.auth;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.VerificationCode;
import com.quolance.quolance_api.jobs.SendWelcomeEmailJob;
import com.quolance.quolance_api.repositories.VerificationCodeRepository;
import com.quolance.quolance_api.services.auth.impl.VerificationCodeServiceImpl;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VerificationCodeServiceUnitTest {

    @Mock
    private VerificationCodeRepository verificationCodeRepository;


    @InjectMocks
    private VerificationCodeServiceImpl verificationCodeService;

    private User mockUser;
    private VerificationCode mockVerificationCode;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(java.util.UUID.randomUUID())
                .email("testuser@example.com")
                .build();

        mockVerificationCode = new VerificationCode(mockUser);
    }

    @Test
    void createVerificationCode_Success() {
        when(verificationCodeRepository.save(mockVerificationCode)).thenReturn(mockVerificationCode);

        VerificationCode result = verificationCodeService.createVerificationCode(mockVerificationCode);

        assertNotNull(result);
        assertEquals(mockVerificationCode, result);
        verify(verificationCodeRepository).save(mockVerificationCode);
    }

    @Test
    void sendVerificationCode_Success() {
        try (var mockedBackgroundJobRequest = mockStatic(BackgroundJobRequest.class)) {
            when(verificationCodeRepository.save(any(VerificationCode.class))).thenReturn(mockVerificationCode);

            verificationCodeService.sendVerificationCode(mockUser);

            mockedBackgroundJobRequest.verify(() -> BackgroundJobRequest.enqueue(any(SendWelcomeEmailJob.class)));
            verify(verificationCodeRepository).save(any(VerificationCode.class));
        }

    }

    @Test
    void findByCode_Success() {
        String code = "123456";
        when(verificationCodeRepository.findByCode(code)).thenReturn(mockVerificationCode);

        VerificationCode result = verificationCodeService.findByCode(code);

        assertNotNull(result);
        assertEquals(mockVerificationCode, result);
        verify(verificationCodeRepository).findByCode(code);
    }

    @Test
    void updateVerificationCodeStatus_Success() {
        when(verificationCodeRepository.save(mockVerificationCode)).thenReturn(mockVerificationCode);

        boolean result = verificationCodeService.updateVerificationCodeStatus(mockVerificationCode);

        assertTrue(result);
        verify(verificationCodeRepository).save(mockVerificationCode);
    }

    @Test
    void deleteVerificationCode_Success() {
        doNothing().when(verificationCodeRepository).delete(mockVerificationCode);

        boolean result = verificationCodeService.deleteVerificationCode(mockVerificationCode);

        assertTrue(result);
        verify(verificationCodeRepository).delete(mockVerificationCode);
    }

    @Test
    void findByCode_NotFound() {
        String code = "nonexistent";
        when(verificationCodeRepository.findByCode(code)).thenReturn(null);

        VerificationCode result = verificationCodeService.findByCode(code);

        assertNull(result);
        verify(verificationCodeRepository).findByCode(code);
    }

    @Test
    void findByCode_EmptyCode() {
        String emptyCode = "";
        VerificationCode result = verificationCodeService.findByCode(emptyCode);

        assertNull(result);
        verify(verificationCodeRepository).findByCode(emptyCode);
    }

    @Test
    void updateVerificationCodeStatus_NullVerificationCode() {
        boolean result = verificationCodeService.updateVerificationCodeStatus(null);

        assertFalse(result);
        verify(verificationCodeRepository).save(null);
    }

    @Test
    void createVerificationCode_DuplicateCode() {
        when(verificationCodeRepository.save(mockVerificationCode)).thenThrow(new RuntimeException("Duplicate code"));

        assertThrows(RuntimeException.class, () -> verificationCodeService.createVerificationCode(mockVerificationCode));
        verify(verificationCodeRepository).save(mockVerificationCode);
    }

    @Test
    void deleteVerificationCode_NotFound() {
        doThrow(new RuntimeException("Verification code not found")).when(verificationCodeRepository).delete(mockVerificationCode);

        assertThrows(RuntimeException.class, () -> verificationCodeService.deleteVerificationCode(mockVerificationCode));
        verify(verificationCodeRepository).delete(mockVerificationCode);
    }

    @Test
    void sendVerificationCode_NullUser() {
        assertThrows(NullPointerException.class, () -> verificationCodeService.sendVerificationCode(null));
        verify(verificationCodeRepository, never()).save(any(VerificationCode.class));
    }



}