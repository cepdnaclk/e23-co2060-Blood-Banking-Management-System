package com.bbms.backend.controller;

import com.bbms.backend.Repository.DonorRepository;
import com.bbms.backend.entity.Donor;
import com.bbms.backend.entity.DonorStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/donors")
@CrossOrigin(origins = "*")
public class AdminDonorController {

    private final DonorRepository donorRepo;

    public AdminDonorController(DonorRepository donorRepo) {
        this.donorRepo = donorRepo;
    }

    // ✅ Get Pending Donors
    @PreAuthorize("hasAnyRole('ADMIN','HOSPITAL_STAFF','RECEPTION_STAFF')")
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingDonors() {

        List<Donor> donors =
                donorRepo.findByStatus(DonorStatus.PENDING_VERIFICATION);

        return ResponseEntity.ok(donors);
    }

    // ✅ Approve Donor
    @PreAuthorize("hasAnyRole('ADMIN','HOSPITAL_STAFF','RECEPTION_STAFF')")
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveDonor(@PathVariable Long id) {

        Donor donor = donorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donor.setStatus(DonorStatus.ACTIVE);
        donor.setApprovedAt(LocalDateTime.now());

        donorRepo.save(donor);

        return ResponseEntity.ok("Donor Approved Successfully");
    }

    // ✅ Reject Donor
    @PreAuthorize("hasAnyRole('ADMIN','HOSPITAL_STAFF','RECEPTION_STAFF')")
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectDonor(
            @PathVariable Long id,
            @RequestBody(required = false) String reason) {

        Donor donor = donorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donor.setStatus(DonorStatus.REJECTED);
        donor.setRejectionReason(reason);
        donor.setApprovedAt(null);

        donorRepo.save(donor);

        return ResponseEntity.ok("Donor Rejected Successfully");
    }
}