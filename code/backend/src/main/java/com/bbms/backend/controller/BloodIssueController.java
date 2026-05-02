package com.bbms.backend.controller;

import com.bbms.backend.entity.BloodIssue;
import com.bbms.backend.entity.Inventory;
import com.bbms.backend.entity.BloodComponent;
import com.bbms.backend.Repository.BloodIssueRepository;
import com.bbms.backend.Repository.InventoryRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class BloodIssueController {

    private final BloodIssueRepository issueRepo;
    private final InventoryRepository inventoryRepo;

    public BloodIssueController(
            BloodIssueRepository issueRepo,
            InventoryRepository inventoryRepo
    ) {
        this.issueRepo = issueRepo;
        this.inventoryRepo = inventoryRepo;
    }

    // ================= CREATE ISSUE =================
    @PostMapping
    public String issueBlood(@RequestBody BloodIssue request) {

        // 🔍 Find inventory
        Inventory inv = inventoryRepo
                .findByBloodGroupAndComponentType(
                        request.getBloodGroup(),
                        request.getComponentType()
                )
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No stock available"));

        // ❌ Check stock
        if (inv.getQuantity() < request.getQuantity()) {
            return "Not enough stock";
        }

        // ✅ Reduce inventory
        inv.setQuantity(inv.getQuantity() - request.getQuantity());
        inv.updateStockStatus();
        inventoryRepo.save(inv);

        // ✅ Save issue
        BloodIssue saved = issueRepo.save(request);

        return "Blood issued successfully (ID: " + saved.getIssueId() + ")";
    }

    // ================= GET ALL =================
    @GetMapping
    public List<BloodIssue> getAll() {
        return issueRepo.findAll();
    }

    // ================= GET BY REQUEST =================
    @GetMapping("/request/{id}")
    public List<BloodIssue> getByRequest(@PathVariable Long id) {
        return issueRepo.findByRequestId(id);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        issueRepo.deleteById(id);
        return "Issue deleted";
    }
}