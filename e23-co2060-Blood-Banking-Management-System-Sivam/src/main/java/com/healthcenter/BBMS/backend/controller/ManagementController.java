package com.healthcenter.BBMS.backend.controller;

import com.healthcenter.BBMS.backend.entity.Donor;
import com.healthcenter.BBMS.backend.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import com.healthcenter.BBMS.backend.entity.BloodGroup;

import java.util.List;

@RestController
@RequestMapping("/api/management")
@CrossOrigin(origins = "http://localhost:3000")
public class ManagementController {

    @Autowired
    private DonorRepository donorRepository;

    // 1. Get all donors who are 'PENDING'
    @GetMapping("/pending")
    public List<Donor> getPendingDonors() {
        return donorRepository.findByStatus("PENDING");
    }

    // 2. Verify a donor (Change status)
    @PutMapping("/verify/{id}")
    public String verifyDonor(@PathVariable Long id, @RequestParam String status) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donor.setStatus(status); // Status will be "APPROVED" or "REJECTED"
        donorRepository.save(donor);

        return "Donor status updated to: " + status;
    }
    @GetMapping("/eligible/{id}")
    public String checkEligibility(@PathVariable Long id) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        if (donor.getLastDonationDate() == null) {
            return "Donor is eligible (First time donor).";
        }

        long daysSinceLastDonation = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());

        if (daysSinceLastDonation >= 90) {
            return "Donor is eligible. Days since last donation: " + daysSinceLastDonation;
        } else {
            return "Donor is NOT eligible. Must wait " + (90 - daysSinceLastDonation) + " more days.";
        }
    }
    @GetMapping("/search")
    public List<Donor> findByBloodGroup(@RequestParam BloodGroup bloodGroup) {
        // This uses the custom method you added to your DonorRepository earlier
        return donorRepository.findByBloodGroup(bloodGroup);
    }
}

