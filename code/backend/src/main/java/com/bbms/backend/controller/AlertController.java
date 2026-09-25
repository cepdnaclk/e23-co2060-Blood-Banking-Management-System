package com.bbms.backend.controller;

import com.bbms.backend.Repository.AlertRepository;
import com.bbms.backend.entity.Alert;
import com.bbms.backend.entity.AlertStatus;
import com.bbms.backend.service.AlertService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertRepository alertRepository;
    private final AlertService alertService;

    public AlertController(AlertRepository alertRepository,
                           AlertService alertService) {
        this.alertRepository = alertRepository;
        this.alertService = alertService;
    }

    // ================= GET ACTIVE ALERTS =================
    // ADMIN + LAB_STAFF + HOSPITAL_STAFF + RECEPTION_STAFF
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'HOSPITAL_STAFF', 'RECEPTION_STAFF')")
    @GetMapping
    public List<Alert> getAlerts() {

        // Generate expiry alerts before returning alerts
        alertService.checkExpiryAlerts();

        return alertRepository.findByStatus(AlertStatus.ACTIVE);
    }

    // ================= RESOLVE ALERT =================
    // ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/resolve")
    public String resolveAlert(@PathVariable Long id) {

        Alert alert = alertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));

        alert.setStatus(AlertStatus.RESOLVED);

        alertRepository.save(alert);

        return "Alert resolved successfully";
    }

    // ================= DELETE ALERT =================
    // ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteAlert(@PathVariable Long id) {

        if (!alertRepository.existsById(id)) {
            throw new RuntimeException("Alert not found");
        }

        alertRepository.deleteById(id);

        return "Alert deleted successfully";
    }
}