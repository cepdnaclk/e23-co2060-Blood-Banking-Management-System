package com.bbms.backend.controller;

import com.bbms.backend.entity.Donation;
import com.bbms.backend.entity.DonationStatus;
import com.bbms.backend.entity.Donor;
import com.bbms.backend.entity.DonorScreening;
import com.bbms.backend.entity.ScreeningStatus;
import com.bbms.backend.Repository.DonationRepository;
import com.bbms.backend.Repository.DonorRepository;
import com.bbms.backend.Repository.DonorScreeningRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000")
public class DonationController {

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;
    private final DonorScreeningRepository screeningRepository;

    public DonationController(
            DonationRepository donationRepository,
            DonorRepository donorRepository,
            DonorScreeningRepository screeningRepository) {

        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
        this.screeningRepository = screeningRepository;
    }

    // ============================================================
    // GET ALL DONATIONS
    // ============================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'RECEPTION_STAFF')")
    public ResponseEntity<List<Donation>> getAllDonations() {

        return ResponseEntity.ok(
                donationRepository.findAll()
        );
    }

    // ============================================================
    // GET DONATION BY ID
    // ============================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'RECEPTION_STAFF')")
    public ResponseEntity<?> getDonationById(
            @PathVariable Long id) {

        Optional<Donation> donation =
                donationRepository.findById(id);

        if (donation.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Donation not found.");
        }

        return ResponseEntity.ok(donation.get());
    }

    // ============================================================
    // GET COMPLETED DONATIONS
    // ============================================================

    @GetMapping("/completed")
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'RECEPTION_STAFF')")
    public ResponseEntity<List<Donation>> getCompletedDonations() {

        return ResponseEntity.ok(
                donationRepository.findByDonationStatus(
                        DonationStatus.COMPLETED
                )
        );
    }

    // ============================================================
    // ADD DONATION
    // ============================================================

    @PostMapping("/{donorId}/{screeningId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTION_STAFF')")
    public ResponseEntity<?> createDonation(
            @PathVariable Long donorId,
            @PathVariable Long screeningId,
            @RequestBody Donation donation) {

        // --------------------------------------------------------
        // 1. Check donor
        // --------------------------------------------------------

        Optional<Donor> donorOptional =
                donorRepository.findById(donorId);

        if (donorOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Donor not found.");
        }

        Donor donor = donorOptional.get();

        // --------------------------------------------------------
        // 2. Check donor status
        // --------------------------------------------------------

        if (donor.getStatus() == null ||
                !donor.getStatus()
                        .name()
                        .equalsIgnoreCase("ACTIVE")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Donation cannot be recorded. " +
                                    "Donor must be ACTIVE."
                    );
        }

        // --------------------------------------------------------
        // 3. Find screening
        // --------------------------------------------------------

        Optional<DonorScreening> screeningOptional =
                screeningRepository.findById(screeningId);

        if (screeningOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Screening not found.");
        }

        DonorScreening screening =
                screeningOptional.get();

        // --------------------------------------------------------
        // 4. Check screening belongs to donor
        // --------------------------------------------------------

        if (screening.getDonor() == null ||
                screening.getDonor().getDonorId() == null ||
                !screening.getDonor()
                        .getDonorId()
                        .equals(donorId)) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "The selected screening does not " +
                                    "belong to the selected donor."
                    );
        }

        // --------------------------------------------------------
        // 5. Check screening eligibility
        // --------------------------------------------------------

        if (screening.getEligibilityStatus()
                != ScreeningStatus.ELIGIBLE) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Donation cannot be recorded. " +
                                    "The screening result is not ELIGIBLE."
                    );
        }

        // --------------------------------------------------------
        // 6. Prevent duplicate donation
        // --------------------------------------------------------

        if (donationRepository
                .existsByScreening(screening)) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A donation already exists " +
                                    "for this screening."
                    );
        }

        // --------------------------------------------------------
        // 7. Validate units collected
        // --------------------------------------------------------

        if (donation.getUnitsCollected() == null ||
                donation.getUnitsCollected() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Units collected must be greater than 0."
                    );
        }

        // --------------------------------------------------------
        // 8. Set donor and screening
        // --------------------------------------------------------

        donation.setDonor(donor);
        donation.setScreening(screening);

        // --------------------------------------------------------
        // 9. Set default values
        // --------------------------------------------------------

        if (donation.getDonationDate() == null) {
            donation.setDonationDate(LocalDate.now());
        }

        if (donation.getDonationStatus() == null) {
            donation.setDonationStatus(
                    DonationStatus.COMPLETED
            );
        }

        // --------------------------------------------------------
        // 10. Save donation
        // --------------------------------------------------------

        Donation savedDonation =
                donationRepository.save(donation);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDonation);
    }

    // ============================================================
    // UPDATE DONATION
    // ============================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTION_STAFF')")
    public ResponseEntity<?> updateDonation(
            @PathVariable Long id,
            @RequestBody Donation updatedDonation) {

        Optional<Donation> optional =
                donationRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Donation not found.");
        }

        Donation existing = optional.get();

        if (updatedDonation.getUnitsCollected() == null ||
                updatedDonation.getUnitsCollected() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Units collected must be greater than 0."
                    );
        }

        existing.setUnitsCollected(
                updatedDonation.getUnitsCollected()
        );

        if (updatedDonation.getDonationDate() != null) {
            existing.setDonationDate(
                    updatedDonation.getDonationDate()
            );
        }

        if (updatedDonation.getDonationStatus() != null) {
            existing.setDonationStatus(
                    updatedDonation.getDonationStatus()
            );
        }

        existing.setRemarks(
                updatedDonation.getRemarks()
        );

        return ResponseEntity.ok(
                donationRepository.save(existing)
        );
    }

    // ============================================================
    // DELETE DONATION
    // ============================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTION_STAFF')")
    public ResponseEntity<?> deleteDonation(
            @PathVariable Long id) {

        if (!donationRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Donation not found.");
        }

        donationRepository.deleteById(id);

        return ResponseEntity.ok(
                "Donation deleted successfully."
        );
    }
}