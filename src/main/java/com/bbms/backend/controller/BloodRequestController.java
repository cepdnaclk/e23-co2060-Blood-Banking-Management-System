package com.bbms.backend.controller;

import com.bbms.backend.Repository.BloodRequestRepository;
import com.bbms.backend.entity.BloodRequest;
import com.bbms.backend.entity.RequestStatus;
import com.bbms.backend.service.AlertService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    private final BloodRequestRepository requestRepo;
    private final AlertService alertService;

    public BloodRequestController(
            BloodRequestRepository requestRepo,
            AlertService alertService) {

        this.requestRepo = requestRepo;
        this.alertService = alertService;
    }

    // =========================================================
    // CREATE REQUEST
    // =========================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL_STAFF')")
    @PostMapping
    public String create(@RequestBody BloodRequest request) {

        // Always start a new request as PENDING
        request.setRequestStatus(RequestStatus.PENDING);

        BloodRequest savedRequest =
                requestRepo.save(request);

        // Emergency alert
        if (savedRequest.getUrgencyLevel() != null
                && savedRequest.getUrgencyLevel()
                .name()
                .equals("EMERGENCY")) {

            alertService.createEmergencyAlert(
                    "Hospital ID " + savedRequest.getHospitalId(),
                    savedRequest.getBloodGroup()
            );
        }

        return "Request Created";
    }

    // =========================================================
    // GET ALL REQUESTS
    // =========================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'HOSPITAL_STAFF')")
    @GetMapping
    public List<BloodRequest> getAll() {

        return requestRepo.findAll();
    }

    // =========================================================
    // GET PENDING REQUESTS
    // =========================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'HOSPITAL_STAFF')")
    @GetMapping("/pending")
    public List<BloodRequest> getPending() {

        return requestRepo.findByRequestStatus(
                RequestStatus.PENDING
        );
    }

    // =========================================================
    // APPROVE REQUEST
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public String approve(@PathVariable Long id) {

        BloodRequest req = requestRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Blood request not found"
                        )
                );

        // Prevent approving an already processed request
        if (req.getRequestStatus() != RequestStatus.PENDING) {

            return "Request is already "
                    + req.getRequestStatus();
        }

        /*
         * IMPORTANT:
         *
         * Approval does NOT reduce inventory.
         * Approval does NOT create BloodIssue.
         *
         * Those actions happen when blood is actually issued.
         */

        req.setRequestStatus(
                RequestStatus.APPROVED
        );

        requestRepo.save(req);

        return "Request Approved";
    }

    // =========================================================
    // REJECT REQUEST
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public String reject(@PathVariable Long id) {

        BloodRequest req = requestRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Blood request not found"
                        )
                );

        // Prevent rejecting an already processed request
        if (req.getRequestStatus() != RequestStatus.PENDING) {

            return "Request is already "
                    + req.getRequestStatus();
        }

        req.setRequestStatus(
                RequestStatus.REJECTED
        );

        requestRepo.save(req);

        return "Request Rejected";
    }
}