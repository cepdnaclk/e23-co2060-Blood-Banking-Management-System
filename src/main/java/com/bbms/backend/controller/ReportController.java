package com.bbms.backend.controller;

import com.bbms.backend.dto.ReportResponse;
import com.bbms.backend.service.ReportService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // ================= DASHBOARD REPORT =================
    // ALL FOUR ROLES CAN VIEW
    @PreAuthorize("hasAnyRole('ADMIN', 'LAB_STAFF', 'HOSPITAL_STAFF', 'RECEPTION_STAFF')")
    @GetMapping
    public ReportResponse getReport() {
        return reportService.generateReport();
    }
}