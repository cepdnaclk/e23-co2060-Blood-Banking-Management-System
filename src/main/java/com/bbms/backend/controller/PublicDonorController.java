package com.bbms.backend.controller;

import com.bbms.backend.entity.Donor;
import com.bbms.backend.service.DonorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/donors")
@CrossOrigin(origins = "*")
public class PublicDonorController {

    private final DonorService service;

    public PublicDonorController(DonorService service) {
        this.service = service;
    }

    // ✅ REGISTER
    @PostMapping
    public ResponseEntity<?> register(@RequestBody Donor donor) {
        try {
            Donor saved = service.register(donor);
            return ResponseEntity.ok(
                    "Registration successful. Donor ID = " + saved.getDonorId()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ CHECK STATUS
    @GetMapping("/status/{nic}")
    public ResponseEntity<?> checkStatus(@PathVariable String nic) {
        return ResponseEntity.ok(service.checkStatus(nic));
    }
}