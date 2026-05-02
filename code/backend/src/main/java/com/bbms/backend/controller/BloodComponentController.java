package com.bbms.backend.controller;

import com.bbms.backend.Repository.BloodComponentRepository;
import com.bbms.backend.Repository.BloodTestRepository;
import com.bbms.backend.Repository.InventoryRepository;
import com.bbms.backend.Repository.DonationRepository;

import com.bbms.backend.entity.BloodComponent;
import com.bbms.backend.entity.BloodTest;
import com.bbms.backend.entity.Inventory;
import com.bbms.backend.entity.Donation;
import com.bbms.backend.entity.OverallBloodTestStatus;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/components")
@CrossOrigin(origins = "*")
public class BloodComponentController {

    private final BloodComponentRepository componentRepo;
    private final BloodTestRepository testRepo;
    private final InventoryRepository inventoryRepo;
    private final DonationRepository donationRepo;

    public BloodComponentController(
            BloodComponentRepository componentRepo,
            BloodTestRepository testRepo,
            InventoryRepository inventoryRepo,
            DonationRepository donationRepo
    ) {
        this.componentRepo = componentRepo;
        this.testRepo = testRepo;
        this.inventoryRepo = inventoryRepo;
        this.donationRepo = donationRepo;
    }

    // ================= CREATE COMPONENT =================
    @PostMapping
    public String create(@RequestBody BloodComponent request) {

        // 🔴 Validate donation input
        if (request.getDonation() == null || request.getDonation().getDonationId() == null) {
            return "Donation ID is required";
        }

        Long donationId = request.getDonation().getDonationId();

        // 🔴 Check donation exists
        Donation donation = donationRepo.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation NOT FOUND"));

        // 🔴 Prevent duplicate components
        if (componentRepo.existsByDonation_DonationId(donationId)) {
            return "Components already created for this donation";
        }

        // 🔴 Check SAFE blood test
        boolean isSafe = testRepo.findAll().stream()
                .anyMatch(t ->
                        t.getDonation().getDonationId().equals(donationId)
                                && t.getOverallResult() == OverallBloodTestStatus.SAFE
                );

        if (!isSafe) {
            return "Blood is not SAFE";
        }

        // ✅ Set correct relationship
        request.setDonation(donation);

        // ✅ Set expiry date
        request.setExpiryDate(getExpiryDate(request.getComponentType()));

        BloodComponent saved = componentRepo.save(request);

        // INVENTORY
        Inventory inv = new Inventory();
        inv.setComponentId(saved.getComponentId());
        inv.setDonationId(donationId);
        inv.setComponentType(saved.getComponentType());
        inv.setQuantity(saved.getQuantity());

        String bloodGroup = donation.getDonor().getBloodGroup().name()
                .replace("_POSITIVE", "+")
                .replace("_NEGATIVE", "-");

        inv.setBloodGroup(bloodGroup);

        inventoryRepo.save(inv);

        return "Component created successfully";
    }

    // ================= GET ALL =================
    @GetMapping
    public List<BloodComponent> getAll() {
        return componentRepo.findAll();
    }

    // ================= GET BY DONATION =================
    @GetMapping("/donation/{id}")
    public List<BloodComponent> getByDonation(@PathVariable Long id) {
        return componentRepo.findByDonation_DonationId(id);
    }

    // ================= EXPIRY LOGIC =================
    private LocalDate getExpiryDate(BloodComponent.ComponentType type) {
        LocalDate today = LocalDate.now();

        switch (type) {
            case RBC:
                return today.plusDays(42);
            case PLASMA:
                return today.plusDays(365);
            case PLATELETS:
                return today.plusDays(5);
            case CRYOPRECIPITATE:
                return today.plusDays(365);
            case WHOLE_BLOOD:
                return today.plusDays(35);
            default:
                return today.plusDays(30);
        }
    }
}