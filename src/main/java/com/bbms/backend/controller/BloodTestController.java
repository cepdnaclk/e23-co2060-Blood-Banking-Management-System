package com.bbms.backend.controller;

import com.bbms.backend.entity.BloodTest;
import com.bbms.backend.Repository.BloodTestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin
public class BloodTestController {

    private final BloodTestRepository repo;

    public BloodTestController(BloodTestRepository repo) {
        this.repo = repo;
    }

    // CREATE
    @PostMapping
    public BloodTest create(@RequestBody BloodTest test) {
        return repo.save(test);
    }

    // GET ALL
    @GetMapping
    public List<BloodTest> getAll() {
        return repo.findAll();
    }
}
