package com.healthcenter.BBMS.backend.controller;

import com.healthcenter.BBMS.backend.entity.Donor;
import com.healthcenter.BBMS.backend.repository.DonorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

        // Required field checks
        if (donor.getFullname() == null || donor.getFullname().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Full name is required.");
        }
        if (donor.getNic() == null || donor.getNic().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("NIC/Student ID is required.");
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

        // Duplicate checks
        if (donorRepository.findByNic(donor.getNic()).isPresent()) {
            return ResponseEntity.badRequest().body("This ID is already registered.");
        }
        if (donor.getEmail() != null && !donor.getEmail().trim().isEmpty()) {
            if (donorRepository.findByEmail(donor.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("This email is already registered.");
            }
        }

        // Age check (>= 18)
        LocalDate today = LocalDate.now();
        int age = Period.between(donor.getDob(), today).getYears();
        if (age < 18) {
            return ResponseEntity.badRequest().body("You must be 18 years or older.");
        }

        //  Phone format check (basic)
        // Sri Lanka style: 10 digits (07XXXXXXXX) OR just 10 digits.
        Pattern phonePattern = Pattern.compile("^(0\\d{9})$");
        if (!phonePattern.matcher(donor.getPhone().trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid phone number. Use 10 digits like 07XXXXXXXX.");
        }

        // Default values
        donor.setStatus("PENDING");
        donor.setCreatedAt(LocalDateTime.now());
        // first time registration
        donor.setLastDonationDate(null);

        //Save
        Donor saved = donorRepository.save(donor);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registration received. Staff will verify. DonorId=" + saved.getDonorId());
    }

}
