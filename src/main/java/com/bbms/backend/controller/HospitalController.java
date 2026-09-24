package com.bbms.backend.controller;

import com.bbms.backend.entity.Hospital;
import com.bbms.backend.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService service;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    // ADMIN + HOSPITAL_STAFF can view hospitals
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL_STAFF')")
    public List<Hospital> getAll() {
        return service.getAll();
    }

    // Only ADMIN can add a hospital
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> add(@RequestBody Hospital hospital) {
        try {
            return ResponseEntity.ok(service.create(hospital));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Only ADMIN can delete a hospital
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Hospital deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}