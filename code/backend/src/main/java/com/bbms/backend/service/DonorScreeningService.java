package com.bbms.backend.service;

import com.bbms.backend.Repository.DonorRepository;
import com.bbms.backend.Repository.DonorScreeningRepository;
import com.bbms.backend.entity.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DonorScreeningService {

    private final DonorScreeningRepository screeningRepo;
    private final DonorRepository donorRepo;

    public DonorScreeningService(DonorScreeningRepository screeningRepo,
                                 DonorRepository donorRepo) {
        this.screeningRepo = screeningRepo;
        this.donorRepo = donorRepo;
    }

    // ✅ CREATE SCREENING
    public DonorScreening create(Long donorId, DonorScreening screening) {

        Donor donor = donorRepo.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        if (donor.getStatus() != DonorStatus.ACTIVE) {
            throw new RuntimeException("Only ACTIVE donors can be screened.");
        }

        if (donor.getNextEligibleDate() != null &&
                LocalDate.now().isBefore(donor.getNextEligibleDate())) {
            throw new RuntimeException(
                    "Not eligible until " + donor.getNextEligibleDate()
            );
        }

        if (screening.getWeight() == null || screening.getHemoglobin() == null) {
            throw new RuntimeException("Weight & hemoglobin required");
        }

        if (screening.getScreeningDate() == null) {
            screening.setScreeningDate(LocalDate.now());
        }

        screening.setDonor(donor);

        // 🔥 ELIGIBILITY LOGIC
        if (screening.getWeight() < 50 || screening.getHemoglobin() < 12.5) {

            screening.setEligibilityStatus(ScreeningStatus.TEMPORARILY_DEFERRED);

            // 🔴 BLOCK donor for 3 months
            donor.setNextEligibleDate(LocalDate.now().plusMonths(3));
            donorRepo.save(donor);

        } else {

            screening.setEligibilityStatus(ScreeningStatus.ELIGIBLE);

            // 🔴 Clear restriction
            donor.setNextEligibleDate(null);
            donorRepo.save(donor);
        }

        return screeningRepo.save(screening);
    }

    // ✅ UPDATE
    public DonorScreening update(Long id, DonorScreening updated) {

        DonorScreening screening = screeningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Screening not found"));

        screening.setHemoglobin(updated.getHemoglobin());
        screening.setWeight(updated.getWeight());
        screening.setBloodPressure(updated.getBloodPressure());
        screening.setTemperature(updated.getTemperature());
        screening.setPulseRate(updated.getPulseRate());
        screening.setMedicalHistory(updated.getMedicalHistory());
        screening.setRemarks(updated.getRemarks());

        if (screening.getWeight() < 50 || screening.getHemoglobin() < 12.5) {
            screening.setEligibilityStatus(ScreeningStatus.TEMPORARILY_DEFERRED);
        } else {
            screening.setEligibilityStatus(ScreeningStatus.ELIGIBLE);
        }

        return screeningRepo.save(screening);
    }

    // ✅ DELETE
    public void delete(Long id) {
        screeningRepo.deleteById(id);
    }

    // ✅ GET ALL
    public List<DonorScreening> getAll() {
        return screeningRepo.findAll();
    }

    // ✅ GET BY ID
    public DonorScreening getById(Long id) {
        return screeningRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    // ✅ GET BY DONOR
    public List<DonorScreening> getByDonor(Long donorId) {

        Donor donor = donorRepo.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        return screeningRepo.findByDonor(donor);
    }
}
