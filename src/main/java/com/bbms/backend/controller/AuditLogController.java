package com.bbms.backend.controller;

import com.bbms.backend.Repository.AuditLogRepository;
import com.bbms.backend.entity.AuditLog;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public AuditLog getAuditLogById(@PathVariable Long id) {

        return auditLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Audit log not found"));
    }
}