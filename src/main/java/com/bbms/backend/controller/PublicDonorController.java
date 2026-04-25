package com.bbms.backend.controller;

import com.bbms.backend.entity.Donor;
import com.bbms.backend.entity.DonorStatus;
import com.bbms.backend.Repository.DonorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/public/donors")
@CrossOrigin(origins = "*")
public class PublicDonorController {

    private final DonorRepository donorRepository;

    public PublicDonorController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @PostMapping
    public ResponseEntity<?> registerDonor(@RequestBody Donor donor) {

        if (donor.getFullName() == null || donor.getFullName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Full name is required.");
        }

        if (donor.getNic() == null || donor.getNic().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("NIC is required.");
        }

        if (donor.getDob() == null) {
            return ResponseEntity.badRequest().body("Date of birth is required.");
        }

        if (donor.getPhone() == null || donor.getPhone().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Phone number is required.");
        }

        if (donor.getBloodGroup() == null) {
            return ResponseEntity.badRequest().body("Blood group is required.");
        }

        if (donor.getGender() == null) {
            return ResponseEntity.badRequest().body("Gender is required.");
        }

        if (donorRepository.findByNic(donor.getNic()).isPresent()) {
            return ResponseEntity.badRequest().body("This ID is already registered.");
        }

        if (donor.getEmail() != null && !donor.getEmail().trim().isEmpty()) {
            if (donorRepository.findByEmail(donor.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("This email is already registered.");
            }
        }

        LocalDate today = LocalDate.now();
        int age = Period.between(donor.getDob(), today).getYears();
        if (age < 18) {
            return ResponseEntity.badRequest().body("You must be 18 years or older.");
        }

        Pattern phonePattern = Pattern.compile("^(0\\d{9})$");
        if (!phonePattern.matcher(donor.getPhone().trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid phone number. Use 10 digits like 07XXXXXXXX.");
        }

        donor.setStatus(DonorStatus.PENDING_VERIFICATION);
        donor.setApprovedBy(null);
        donor.setApprovedAt(null);
        donor.setRejectionReason(null);
        donor.setLastDonationDate(null);
        donor.setNextEligibleDate(null);

        Donor saved = donorRepository.save(donor);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registration received. Staff will verify. Donor ID = " + saved.getDonorId());
    }
}
