package com.bbms.backend.controller;

import com.bbms.backend.entity.BloodRequest;
import com.bbms.backend.entity.Inventory;
import com.bbms.backend.Repository.BloodRequestRepository;
import com.bbms.backend.Repository.InventoryRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin
public class BloodRequestController {

    private final BloodRequestRepository requestRepo;
    private final InventoryRepository inventoryRepo;

    public BloodRequestController(BloodRequestRepository requestRepo,
                                  InventoryRepository inventoryRepo) {
        this.requestRepo = requestRepo;
        this.inventoryRepo = inventoryRepo;
    }

    // CREATE REQUEST
    @PostMapping
    public BloodRequest create(@RequestBody BloodRequest request) {
        return requestRepo.save(request);
    }

    // GET ALL REQUESTS
    @GetMapping
    public List<BloodRequest> getAll() {
        return requestRepo.findAll();
    }

    // APPROVE REQUEST
    @PutMapping("/approve/{id}")
    public String approve(@PathVariable Long id) {

        BloodRequest req = requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Check inventory
        List<Inventory> stock = inventoryRepo.findAll();

        Inventory match = stock.stream()
                .filter(i -> i.getBloodGroup().equals(req.getBloodGroup())
                        && i.getComponentType() == req.getComponentType()
                        && i.getQuantity() >= req.getQuantity())
                .findFirst()
                .orElse(null);

        if (match == null) {
            req.setStatus(BloodRequest.Status.REJECTED);
            requestRepo.save(req);
            return "Request Rejected - Not enough stock";
        }

        // Reduce stock
        match.setQuantity(match.getQuantity() - req.getQuantity());
        inventoryRepo.save(match);

        req.setStatus(BloodRequest.Status.APPROVED);
        requestRepo.save(req);

        return "Request Approved";
    }
}
