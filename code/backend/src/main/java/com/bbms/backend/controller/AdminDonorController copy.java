package com.bbms.backend.controller;

import com.bbms.backend.Repository.DonorRepository;
import com.bbms.backend.entity.Donor;
import com.bbms.backend.entity.DonorStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/donors")
@CrossOrigin(origins = "*")
public class AdminDonorController {

    private final DonorRepository donorRepo;

    public AdminDonorController(DonorRepository donorRepo) {
        this.donorRepo = donorRepo;
    }

    // ✅ CENTRAL ROLE CHECK (UPDATED)
    private boolean isAuthorized(String role) {
        if (role == null) return false;

        role = role.trim().toUpperCase();

        return Set.of(
                "ADMIN",
                "HOSPITAL_STAFF",
                "RECEPTION_STAFF"
        ).contains(role);
    }

    // ✅ 1. GET PENDING DONORS
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingDonors(
            @RequestHeader(value = "role", required = false) String role) {

        if (!isAuthorized(role)) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        List<Donor> donors =
                donorRepo.findByStatus(DonorStatus.PENDING_VERIFICATION);

        return ResponseEntity.ok(donors);
    }

    // ✅ 2. APPROVE DONOR
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveDonor(
            @PathVariable Long id,
            @RequestHeader(value = "role", required = false) String role) {

        if (!isAuthorized(role)) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        Donor donor = donorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donor.setStatus(DonorStatus.ACTIVE);
        donor.setApprovedAt(LocalDateTime.now());

        donorRepo.save(donor);

        return ResponseEntity.ok("Donor Approved Successfully");
    }

    // ✅ 3. REJECT DONOR
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectDonor(
            @PathVariable Long id,
            @RequestBody(required = false) String reason,
            @RequestHeader(value = "role", required = false) String role) {

        if (!isAuthorized(role)) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        Donor donor = donorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donor.setStatus(DonorStatus.REJECTED);
        donor.setRejectionReason(reason);
        donor.setApprovedAt(null);

        donorRepo.save(donor);

        return ResponseEntity.ok("Donor Rejected Successfully");
    }
}