package com.bbms.backend.service;

import com.bbms.backend.Repository.DonorRepository;
import com.bbms.backend.Repository.DonorScreeningRepository;
import com.bbms.backend.entity.Donor;
import com.bbms.backend.entity.DonorScreening;
import com.bbms.backend.entity.DonorStatus;
import com.bbms.backend.entity.ScreeningStatus;

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
class DonorScreeningServiceTest {

    @Mock
    private DonorScreeningRepository screeningRepository;

    @Mock
    private DonorRepository donorRepository;

    private DonorScreeningService screeningService;

    @BeforeEach
    void setUp() {
        screeningService = new DonorScreeningService(
                screeningRepository,
                donorRepository
        );
    }

    @Test
    void createEligibleDonor_shouldSetEligibleStatus() {

        Donor donor = new Donor();

        donor.setDonorId(1L);
        donor.setStatus(DonorStatus.ACTIVE);

        DonorScreening screening = new DonorScreening();

        screening.setWeight(60.0);
        screening.setHemoglobin(13.5);
        screening.setTemperature(36.8);
        screening.setPulseRate(80);

        when(donorRepository.findById(1L))
                .thenReturn(Optional.of(donor));

        when(donorRepository.save(any(Donor.class)))
                .thenReturn(donor);

        when(screeningRepository.save(any(DonorScreening.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DonorScreening result =
                screeningService.create(1L, screening);

        assertNotNull(result);

        assertEquals(
                ScreeningStatus.ELIGIBLE,
                result.getEligibilityStatus()
        );

        assertEquals(donor, result.getDonor());

        assertNull(donor.getNextEligibleDate());

        verify(donorRepository).save(donor);
        verify(screeningRepository).save(screening);
    }

    @Test
    void createLowWeightDonor_shouldBeTemporarilyDeferred() {

        Donor donor = new Donor();

        donor.setDonorId(1L);
        donor.setStatus(DonorStatus.ACTIVE);

        DonorScreening screening = new DonorScreening();

        screening.setWeight(45.0);
        screening.setHemoglobin(13.5);
        screening.setTemperature(36.8);
        screening.setPulseRate(80);

        when(donorRepository.findById(1L))
                .thenReturn(Optional.of(donor));

        when(donorRepository.save(any(Donor.class)))
                .thenReturn(donor);

        when(screeningRepository.save(any(DonorScreening.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DonorScreening result =
                screeningService.create(1L, screening);

        assertEquals(
                ScreeningStatus.TEMPORARILY_DEFERRED,
                result.getEligibilityStatus()
        );

        assertEquals(
                LocalDate.now().plusMonths(3),
                donor.getNextEligibleDate()
        );

        verify(donorRepository).save(donor);
        verify(screeningRepository).save(screening);
    }

    @Test
    void createLowHemoglobinDonor_shouldBeTemporarilyDeferred() {

        Donor donor = new Donor();

        donor.setDonorId(1L);
        donor.setStatus(DonorStatus.ACTIVE);

        DonorScreening screening = new DonorScreening();

        screening.setWeight(60.0);
        screening.setHemoglobin(11.0);
        screening.setTemperature(36.8);
        screening.setPulseRate(80);

        when(donorRepository.findById(1L))
                .thenReturn(Optional.of(donor));

        when(donorRepository.save(any(Donor.class)))
                .thenReturn(donor);

        when(screeningRepository.save(any(DonorScreening.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DonorScreening result =
                screeningService.create(1L, screening);

        assertEquals(
                ScreeningStatus.TEMPORARILY_DEFERRED,
                result.getEligibilityStatus()
        );

        assertNotNull(donor.getNextEligibleDate());

        verify(donorRepository).save(donor);
        verify(screeningRepository).save(screening);
    }

    @Test
    void createBlockedDonor_shouldThrowException() {

        Donor donor = new Donor();

        donor.setDonorId(1L);
        donor.setStatus(DonorStatus.BLOCKED);

        DonorScreening screening = new DonorScreening();

        screening.setWeight(60.0);
        screening.setHemoglobin(13.5);
        screening.setTemperature(36.8);
        screening.setPulseRate(80);

        when(donorRepository.findById(1L))
                .thenReturn(Optional.of(donor));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> screeningService.create(1L, screening)
        );

        assertEquals(
                "Only ACTIVE donors can be screened.",
                exception.getMessage()
        );

        verify(screeningRepository, never())
                .save(any(DonorScreening.class));
    }

    @Test
    void createWithoutWeight_shouldThrowException() {

        Donor donor = new Donor();

        donor.setDonorId(1L);
        donor.setStatus(DonorStatus.ACTIVE);

        DonorScreening screening = new DonorScreening();

        screening.setWeight(null);
        screening.setHemoglobin(13.5);

        when(donorRepository.findById(1L))
                .thenReturn(Optional.of(donor));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> screeningService.create(1L, screening)
        );

        assertEquals(
                "Weight & hemoglobin required",
                exception.getMessage()
        );

        verify(screeningRepository, never())
                .save(any(DonorScreening.class));
    }

    @Test
    void createDonorWithFutureEligibleDate_shouldThrowException() {

        Donor donor = new Donor();

        donor.setDonorId(1L);
        donor.setStatus(DonorStatus.ACTIVE);

        donor.setNextEligibleDate(
                LocalDate.now().plusDays(10)
        );

        DonorScreening screening = new DonorScreening();

        screening.setWeight(60.0);
        screening.setHemoglobin(13.5);
        screening.setTemperature(36.8);
        screening.setPulseRate(80);

        when(donorRepository.findById(1L))
                .thenReturn(Optional.of(donor));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> screeningService.create(1L, screening)
        );

        assertTrue(
                exception.getMessage()
                        .startsWith("Not eligible until")
        );

        verify(screeningRepository, never())
                .save(any(DonorScreening.class));
    }
}