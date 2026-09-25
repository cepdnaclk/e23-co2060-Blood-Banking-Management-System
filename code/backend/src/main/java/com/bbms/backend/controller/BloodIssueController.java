package com.bbms.backend.controller;

import com.bbms.backend.Repository.BloodIssueRepository;
import com.bbms.backend.Repository.BloodRequestRepository;
import com.bbms.backend.Repository.InventoryRepository;

import com.bbms.backend.entity.BloodIssue;
import com.bbms.backend.entity.BloodRequest;
import com.bbms.backend.entity.Inventory;
import com.bbms.backend.entity.RequestStatus;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-issues")
@CrossOrigin(origins = "*")
public class BloodIssueController {

    private final BloodIssueRepository issueRepo;
    private final InventoryRepository inventoryRepo;
    private final BloodRequestRepository requestRepo;

    public BloodIssueController(
            BloodIssueRepository issueRepo,
            InventoryRepository inventoryRepo,
            BloodRequestRepository requestRepo) {

        this.issueRepo = issueRepo;
        this.inventoryRepo = inventoryRepo;
        this.requestRepo = requestRepo;
    }

    // =========================================================
    // CREATE BLOOD ISSUE
    // ADMIN ONLY
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public String issueBlood(@RequestBody BloodIssue request) {

        // -----------------------------------------------------
        // Validate request ID
        // -----------------------------------------------------

        if (request.getRequestId() == null) {
            throw new RuntimeException(
                    "Request ID is required"
            );
        }

        // -----------------------------------------------------
        // Find blood request
        // -----------------------------------------------------

        BloodRequest bloodRequest =
                requestRepo.findById(request.getRequestId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blood request not found"
                                )
                        );

        // -----------------------------------------------------
        // Request must be APPROVED
        // -----------------------------------------------------

        if (bloodRequest.getRequestStatus()
                != RequestStatus.APPROVED) {

            throw new RuntimeException(
                    "Only APPROVED blood requests can be issued"
            );
        }

        // -----------------------------------------------------
        // Validate quantity
        // -----------------------------------------------------

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        // -----------------------------------------------------
        // Quantity cannot exceed requested quantity
        // -----------------------------------------------------

        if (request.getQuantity()
                > bloodRequest.getUnitsRequired()) {

            throw new RuntimeException(
                    "Issue quantity cannot exceed requested quantity"
            );
        }

        // -----------------------------------------------------
        // Get blood group from request
        // -----------------------------------------------------

        request.setBloodGroup(
                bloodRequest.getBloodGroup()
        );

        // -----------------------------------------------------
        // Component must be provided
        // -----------------------------------------------------

        if (request.getComponentType() == null) {

            throw new RuntimeException(
                    "Component type is required"
            );
        }

        // -----------------------------------------------------
        // Find matching inventory
        // -----------------------------------------------------

        List<Inventory> inventories =
                inventoryRepo.findByBloodGroupAndComponentType(
                        request.getBloodGroup(),
                        request.getComponentType()
                );

        Inventory inventory = inventories
                .stream()
                .filter(i ->
                        i.getQuantity() != null &&
                                i.getQuantity() >= request.getQuantity()
                )
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Not enough blood stock available"
                        )
                );

        // -----------------------------------------------------
        // Reduce inventory
        // -----------------------------------------------------

        double remainingQuantity =
                inventory.getQuantity()
                        - request.getQuantity();

        inventory.setQuantity(
                remainingQuantity
        );

        inventory.updateStockStatus();

        inventoryRepo.save(inventory);

        // -----------------------------------------------------
        // Save blood issue
        // -----------------------------------------------------

        BloodIssue savedIssue =
                issueRepo.save(request);

        // -----------------------------------------------------
        // Return success
        // -----------------------------------------------------

        return "Blood issued successfully. Issue ID: "
                + savedIssue.getIssueId();
    }

    // =========================================================
    // GET ALL BLOOD ISSUES
    // =========================================================

    @PreAuthorize(
            "hasAnyRole('ADMIN','LAB_STAFF','HOSPITAL_STAFF')"
    )
    @GetMapping
    public List<BloodIssue> getAll() {

        return issueRepo.findAll();
    }

    // =========================================================
    // GET ISSUES BY REQUEST
    // =========================================================

    @PreAuthorize(
            "hasAnyRole('ADMIN','LAB_STAFF','HOSPITAL_STAFF')"
    )
    @GetMapping("/request/{id}")
    public List<BloodIssue> getByRequest(
            @PathVariable Long id) {

        return issueRepo.findByRequestId(id);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        issueRepo.deleteById(id);

        return "Issue deleted successfully";
    }
}