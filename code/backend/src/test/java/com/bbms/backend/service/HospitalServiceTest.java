package com.bbms.backend.service;

import com.bbms.backend.Repository.HospitalRepository;
import com.bbms.backend.entity.Hospital;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HospitalServiceTest {

    @Mock
    private HospitalRepository hospitalRepository;

    private HospitalService hospitalService;

    @BeforeEach
    void setUp() {
        hospitalService = new HospitalService(hospitalRepository);
    }

    @Test
    void getAll_shouldReturnAllHospitals() {

        Hospital hospital1 = new Hospital();
        hospital1.setName("Peradeniya Teaching Hospital");

        Hospital hospital2 = new Hospital();
        hospital2.setName("Kandy General Hospital");

        when(hospitalRepository.findAll())
                .thenReturn(Arrays.asList(hospital1, hospital2));

        List<Hospital> result = hospitalService.getAll();

        assertEquals(2, result.size());
        assertEquals(
                "Peradeniya Teaching Hospital",
                result.get(0).getName()
        );
        assertEquals(
                "Kandy General Hospital",
                result.get(1).getName()
        );

        verify(hospitalRepository).findAll();
    }

    @Test
    void createValidHospital_shouldSaveSuccessfully() {

        Hospital hospital = new Hospital();

        hospital.setName("Peradeniya Teaching Hospital");

        when(hospitalRepository.save(any(Hospital.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Hospital result = hospitalService.create(hospital);

        assertNotNull(result);
        assertEquals(
                "Peradeniya Teaching Hospital",
                result.getName()
        );

        verify(hospitalRepository).save(hospital);
    }

    @Test
    void createHospitalWithoutName_shouldThrowException() {

        Hospital hospital = new Hospital();

        hospital.setName("");

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> hospitalService.create(hospital)
        );

        assertEquals(
                "Hospital name required",
                exception.getMessage()
        );

        verify(hospitalRepository, never())
                .save(any(Hospital.class));
    }

    @Test
    void deleteNonExistingHospital_shouldThrowException() {

        Long hospitalId = 999L;

        when(hospitalRepository.existsById(hospitalId))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> hospitalService.delete(hospitalId)
        );

        assertEquals(
                "Hospital not found",
                exception.getMessage()
        );

        verify(hospitalRepository, never())
                .deleteById(hospitalId);
    }
}
