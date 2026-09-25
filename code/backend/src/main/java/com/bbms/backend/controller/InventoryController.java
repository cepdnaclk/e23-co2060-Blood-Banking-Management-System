package com.bbms.backend.controller;

import com.bbms.backend.entity.Inventory;
import com.bbms.backend.Repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryRepository repo;

    public InventoryController(InventoryRepository repo) {
        this.repo = repo;
    }

    // ================= GET ALL =================
    // ADMIN + LAB_STAFF + HOSPITAL_STAFF + RECEPTION_STAFF
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'HOSPITAL_STAFF', 'RECEPTION_STAFF')")
    @GetMapping
    public List<Inventory> getAll() {
        return repo.findAll();
    }

    // ================= FILTER BY BLOOD GROUP =================
    // ADMIN + LAB_STAFF + HOSPITAL_STAFF + RECEPTION_STAFF
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'HOSPITAL_STAFF', 'RECEPTION_STAFF')")
    @GetMapping("/group/{group}")
    public List<Inventory> getByGroup(@PathVariable String group) {
        return repo.findByBloodGroup(group);
    }
}