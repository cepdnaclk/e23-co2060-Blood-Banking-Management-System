package com.bbms.backend.service;

import com.bbms.backend.Repository.DonorRepository;
import com.bbms.backend.entity.Donor;
import com.bbms.backend.entity.DonorStatus;
import com.bbms.backend.entity.Gender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonorServiceTest {

    @Mock
    private DonorRepository donorRepository;

    private DonorService donorService;

    @BeforeEach
    void setUp() {
        donorService = new DonorService(donorRepository);
    }

    @Test
    void registerValidDonor_shouldRegisterSuccessfully() {

        Donor donor = new Donor();

        donor.setFullName("Test Donor");
        donor.setNic("991234567V");
        donor.setDob(LocalDate.now().minusYears(25));
        donor.setPhone("0712345678");
        donor.setGender(Gender.MALE);

        when(donorRepository.findByNic(donor.getNic()))
                .thenReturn(Optional.empty());


        when(donorRepository.save(any(Donor.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Donor result = donorService.register(donor);

        assertNotNull(result);
        assertEquals(
                DonorStatus.PENDING_VERIFICATION,
                result.getStatus()
        );

        verify(donorRepository).save(donor);
    }

    @Test
    void registerDonorWithoutName_shouldThrowException() {

        Donor donor = new Donor();

        donor.setFullName("");
        donor.setNic("991234567V");
        donor.setDob(LocalDate.now().minusYears(25));
        donor.setPhone("0712345678");
        donor.setGender(Gender.MALE);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> donorService.register(donor)
        );

        assertEquals(
                "Full name is required.",
                exception.getMessage()
        );

        verifyNoInteractions(donorRepository);
    }

    @Test
    void registerDuplicateNic_shouldThrowException() {

        Donor donor = new Donor();

        donor.setFullName("Test Donor");
        donor.setNic("991234567V");
        donor.setDob(LocalDate.now().minusYears(25));
        donor.setPhone("0712345678");
        donor.setGender(Gender.MALE);

        when(donorRepository.findByNic(donor.getNic()))
                .thenReturn(Optional.of(donor));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> donorService.register(donor)
        );

        assertEquals(
                "This NIC is already registered.",
                exception.getMessage()
        );

        verify(donorRepository, never()).save(any(Donor.class));
    }

    @Test
    void registerUnder18Donor_shouldThrowException() {

        Donor donor = new Donor();

        donor.setFullName("Young Donor");
        donor.setNic("200012345678");
        donor.setDob(LocalDate.now().minusYears(17));
        donor.setPhone("0712345678");
        donor.setGender(Gender.FEMALE);

        when(donorRepository.findByNic(donor.getNic()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> donorService.register(donor)
        );

        assertEquals(
                "Must be 18+ to register.",
                exception.getMessage()
        );
    }

    @Test
    void registerInvalidPhone_shouldThrowException() {

        Donor donor = new Donor();

        donor.setFullName("Test Donor");
        donor.setNic("991234567V");
        donor.setDob(LocalDate.now().minusYears(25));
        donor.setPhone("12345");
        donor.setGender(Gender.MALE);

        when(donorRepository.findByNic(donor.getNic()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> donorService.register(donor)
        );

        assertEquals(
                "Invalid phone number.",
                exception.getMessage()
        );
    }

    @Test
    void checkStatusExistingDonor_shouldReturnStatus() {

        Donor donor = new Donor();

        donor.setNic("991234567V");
        donor.setStatus(DonorStatus.ACTIVE);

        when(donorRepository.findByNic("991234567V"))
                .thenReturn(Optional.of(donor));

        String result = donorService.checkStatus("991234567V");

        assertEquals("ACTIVE", result);
    }

    @Test
    void checkStatusUnknownDonor_shouldReturnNotRegistered() {

        when(donorRepository.findByNic("999999999V"))
                .thenReturn(Optional.empty());

        String result = donorService.checkStatus("999999999V");

        assertEquals("NOT_REGISTERED", result);
    }
}