package com.bbms.backend.controller;

import com.bbms.backend.entity.Donor;
import com.bbms.backend.service.DonorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donor-management")
@CrossOrigin(origins = "*")
public class DonorManagementController {

    private final DonorService service;

    public DonorManagementController(DonorService service) {
        this.service = service;
    }

    // ADMIN + LAB_STAFF + RECEPTION_STAFF can view donors
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'RECEPTION_STAFF')")
    public List<Donor> getAllDonors() {
        return service.getAllDonors();
    }
}