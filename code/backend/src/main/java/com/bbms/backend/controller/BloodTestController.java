package com.bbms.backend.controller;

import com.bbms.backend.Repository.BloodTestRepository;
import com.bbms.backend.Repository.DonationRepository;
import com.bbms.backend.entity.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/blood-tests")
@CrossOrigin(origins = "*")
public class BloodTestController {

    private final BloodTestRepository bloodTestRepository;
    private final DonationRepository donationRepository;

    public BloodTestController(BloodTestRepository bloodTestRepository,
                               DonationRepository donationRepository) {
        this.bloodTestRepository = bloodTestRepository;
        this.donationRepository = donationRepository;
    }

    // ===================== CREATE =====================
    @PostMapping
    public ResponseEntity<?> createBloodTest(@RequestBody BloodTest test) {

        // ✅ Validate donation
        if (test.getDonation() == null || test.getDonation().getDonationId() == null) {
            return ResponseEntity.badRequest().body("Donation ID is required.");
        }

        // ✅ Fetch real donation from DB
        Donation donation = donationRepository
                .findById(test.getDonation().getDonationId())
                .orElse(null);

        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found.");
        }

        // ✅ Check donation status
        if (donation.getDonationStatus() == null ||
                donation.getDonationStatus() != DonationStatus.COMPLETED) {
            return ResponseEntity.badRequest().body("Donation must be COMPLETED.");
        }

        // ✅ OPTIONAL: prevent duplicate test
        if (bloodTestRepository.existsByDonation(donation)) {
            return ResponseEntity.badRequest().body("Test already exists for this donation.");
        }

        // ✅ Set correct relation
        test.setDonation(donation);

        // ✅ Auto set date
        if (test.getTestDate() == null) {
            test.setTestDate(LocalDate.now());
        }

        // ✅ Calculate overall result
        test.setOverallResult(calculateOverallResult(test));

        return ResponseEntity.ok(bloodTestRepository.save(test));
    }

    // ===================== GET ALL =====================
    @GetMapping
    public ResponseEntity<?> getAllBloodTests() {
        try {
            List<BloodTest> tests = bloodTestRepository.findAll();
            return ResponseEntity.ok(tests);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching data: " + e.getMessage());
        }
    }

    // ===================== GET BY ID =====================
    @GetMapping("/{id}")
    public ResponseEntity<?> getBloodTestById(@PathVariable Long id) {
        return bloodTestRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().body("Blood test not found"));
    }

    // ===================== GET BY DONATION =====================
    @GetMapping("/donation/{donationId}")
    public ResponseEntity<?> getByDonation(@PathVariable Long donationId) {

        Donation donation = donationRepository.findById(donationId).orElse(null);

        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found");
        }

        return ResponseEntity.ok(bloodTestRepository.findByDonation(donation));
    }

    // ===================== UPDATE =====================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBloodTest(@PathVariable Long id,
                                             @RequestBody BloodTest updated) {

        BloodTest test = bloodTestRepository.findById(id).orElse(null);

        if (test == null) {
            return ResponseEntity.badRequest().body("Test not found");
        }

        test.setHiv(updated.getHiv());
        test.setHepatitisB(updated.getHepatitisB());
        test.setHepatitisC(updated.getHepatitisC());
        test.setMalaria(updated.getMalaria());
        test.setSyphilis(updated.getSyphilis());
        test.setRemarks(updated.getRemarks());

        // 🔥 Recalculate
        test.setOverallResult(calculateOverallResult(test));

        return ResponseEntity.ok(bloodTestRepository.save(test));
    }

    // ===================== DELETE =====================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBloodTest(@PathVariable Long id) {
        if (!bloodTestRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Test not found");
        }

        bloodTestRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // ===================== LOGIC =====================
    private OverallBloodTestStatus calculateOverallResult(BloodTest test) {

        TestResultStatus[] results = {
                test.getHiv(),
                test.getHepatitisB(),
                test.getHepatitisC(),
                test.getMalaria(),
                test.getSyphilis()
        };

        boolean hasPending = false;

        for (TestResultStatus r : results) {

            if (r == TestResultStatus.POSITIVE) {
                return OverallBloodTestStatus.UNSAFE;
            }

            if (r == null || r == TestResultStatus.PENDING) {
                hasPending = true;
            }
        }

        return hasPending
                ? OverallBloodTestStatus.PENDING
                : OverallBloodTestStatus.SAFE;
    }
}