package com.bbms.backend.controller;

import com.bbms.backend.entity.Inventory;
import com.bbms.backend.Repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin
public class InventoryController {

    private final InventoryRepository repo;

    public InventoryController(InventoryRepository repo) {
        this.repo = repo;
    }

    // GET ALL
    @GetMapping
    public List<Inventory> getAll() {
        return repo.findAll();
    }

    // FILTER BY BLOOD GROUP
    @GetMapping("/group/{group}")
    public List<Inventory> getByGroup(@PathVariable String group) {
        return repo.findByBloodGroup(group);
    }
}
