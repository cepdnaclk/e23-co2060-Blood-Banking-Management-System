package com.bbms.backend.controller;

import com.bbms.backend.entity.BloodComponent;
import com.bbms.backend.Repository.BloodComponentRepository;
import com.bbms.backend.Repository.BloodTestRepository;
import com.bbms.backend.entity.BloodTest;
import com.bbms.backend.entity.Inventory;
import com.bbms.backend.Repository.InventoryRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/components")
@CrossOrigin
public class BloodComponentController {

    private final BloodComponentRepository componentRepo;
    private final BloodTestRepository testRepo;
    private final InventoryRepository inventoryRepo;

    public BloodComponentController(BloodComponentRepository componentRepo,
                                    BloodTestRepository testRepo,
                                    InventoryRepository inventoryRepo) {
        this.componentRepo = componentRepo;
        this.testRepo = testRepo;
        this.inventoryRepo = inventoryRepo;
    }

    // CREATE COMPONENTS
    @PostMapping
    public String create(@RequestBody BloodComponent request) {

        Long donationId = request.getDonationId();

        // Preventing duplicate
        if (componentRepo.existsByDonationId(donationId)) {
            return "Components already created for this donation";
        }

        // Checking blood test
        List<BloodTest> tests = testRepo.findAll();

        boolean isSafe = tests.stream()
                .anyMatch(t -> t.getDonationId().equals(donationId)
                        && t.getOverallResult() == BloodTest.Result.SAFE);

        if (!isSafe) {
            return "Blood is not SAFE";
        }

        // Set expiry based on type
        LocalDate expiry = getExpiryDate(request.getComponentType());

        request.setExpiryDate(expiry);

        BloodComponent saved = componentRepo.save(request);

        // Create inventory record
        Inventory inv = new Inventory();
        inv.setComponentId(saved.getComponentId());
        inv.setDonationId(saved.getDonationId());
        inv.setComponentType(saved.getComponentType());
        inv.setQuantity(saved.getQuantity());

        // TEMP: hardcoded blood group
        inv.setBloodGroup("A+");

        inventoryRepo.save(inv);

        return "Component created successfully";
    }

    // Get all
    @GetMapping
    public List<BloodComponent> getAll() {
        return componentRepo.findAll();
    }

    // Get by donation
    @GetMapping("/donation/{id}")
    public List<BloodComponent> getByDonation(@PathVariable Long id) {
        return componentRepo.findByDonationId(id);
    }

    // Helper
    private LocalDate getExpiryDate(BloodComponent.ComponentType type) {
        LocalDate today = LocalDate.now();

        switch (type) {
            case RBC:
                return today.plusDays(42);
            case PLASMA:
                return today.plusDays(365);
            case PLATELETS:
                return today.plusDays(5);
            default:
                return today.plusDays(30);
        }
    }
}
