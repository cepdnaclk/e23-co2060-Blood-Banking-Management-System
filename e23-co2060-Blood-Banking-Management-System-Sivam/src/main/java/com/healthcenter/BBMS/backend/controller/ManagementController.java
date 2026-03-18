package com.healthcenter.BBMS.backend.controller;

import com.healthcenter.BBMS.backend.entity.Donor;
import com.healthcenter.BBMS.backend.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
