package com.bbms.backend.controller;

import com.bbms.backend.entity.Donation;
import com.bbms.backend.Repository.DonationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationRepository repo;

    public DonationController(DonationRepository repo) {
        this.repo = repo;
    }

    // Create donation
    @PostMapping
    public Donation create(@RequestBody Donation donation) {
        return repo.save(donation);
    }

    // Get all
    @GetMapping
    public List<Donation> getAll() {
        return repo.findAll();
    }
}
