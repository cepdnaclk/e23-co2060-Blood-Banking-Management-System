package com.bbms.backend.controller;

import com.bbms.backend.Repository.BloodRequestRepository;
import com.bbms.backend.Repository.InventoryRepository;
import com.bbms.backend.entity.BloodRequest;
import com.bbms.backend.entity.Inventory;
import com.bbms.backend.entity.RequestStatus;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    private final BloodRequestRepository requestRepo;
    private final InventoryRepository inventoryRepo;

    public BloodRequestController(BloodRequestRepository requestRepo,
                                  InventoryRepository inventoryRepo) {
        this.requestRepo = requestRepo;
        this.inventoryRepo = inventoryRepo;
    }

    // 🔹 CREATE REQUEST
    @PostMapping
    public String create(@RequestBody BloodRequest request) {
        requestRepo.save(request);
        return "Request Created";
    }

    // 🔹 GET ALL
    @GetMapping
    public List<BloodRequest> getAll() {
        return requestRepo.findAll();
    }

    // 🔹 GET PENDING
    @GetMapping("/pending")
    public List<BloodRequest> getPending() {
        return requestRepo.findByRequestStatus(RequestStatus.PENDING);
    }

    // 🔹 APPROVE
    @PutMapping("/{id}/approve")
    public String approve(@PathVariable Long id) {

        BloodRequest req = requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        Inventory inv = inventoryRepo.findAll().stream()
                .filter(i -> i.getBloodGroup().equals(req.getBloodGroup())
                        && i.getComponentType() == req.getComponentType())
                .findFirst()
                .orElse(null);

        if (inv == null || inv.getQuantity() < req.getUnitsRequired()) {
            req.setRequestStatus(RequestStatus.REJECTED);
            requestRepo.save(req);
            return "Not enough stock";
        }

        // 🔥 REDUCE STOCK
        inv.setQuantity(inv.getQuantity() - req.getUnitsRequired());
        inv.updateStockStatus();
        inventoryRepo.save(inv);

        req.setRequestStatus(RequestStatus.APPROVED);
        requestRepo.save(req);

        return "Approved";
    }

    // 🔹 REJECT
    @PutMapping("/{id}/reject")
    public String reject(@PathVariable Long id) {

        BloodRequest req = requestRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        req.setRequestStatus(RequestStatus.REJECTED);
        requestRepo.save(req);

        return "Rejected";
    }
}