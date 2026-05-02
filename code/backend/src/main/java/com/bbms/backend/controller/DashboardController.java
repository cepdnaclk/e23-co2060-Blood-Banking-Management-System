package com.bbms.backend.controller;

import com.bbms.backend.Repository.*;
import com.bbms.backend.entity.DonorStatus;
import com.bbms.backend.entity.RequestStatus;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DonorRepository donorRepo;
    private final InventoryRepository inventoryRepo;
    private final HospitalRepository hospitalRepo;
    private final BloodRequestRepository requestRepo;
    private final BloodIssueRepository issueRepo;

    public DashboardController(
            DonorRepository donorRepo,
            InventoryRepository inventoryRepo,
            HospitalRepository hospitalRepo,
            BloodRequestRepository requestRepo,
            BloodIssueRepository issueRepo
    ) {
        this.donorRepo = donorRepo;
        this.inventoryRepo = inventoryRepo;
        this.hospitalRepo = hospitalRepo;
        this.requestRepo = requestRepo;
        this.issueRepo = issueRepo;
    }

    // ================= MAIN DASHBOARD =================
    @GetMapping
    public Map<String, Object> getDashboardData() {

        Map<String, Object> data = new HashMap<>();

        // 🔹 Donors
        long totalDonors = donorRepo.count();
        long pendingDonors = donorRepo.countByStatus(DonorStatus.PENDING_VERIFICATION);

        // 🔹 Hospitals
        long totalHospitals = hospitalRepo.count();

        // 🔹 Inventory
        Double totalUnits = inventoryRepo.sumAllUnits();
        if (totalUnits == null) totalUnits = 0.0;

        // 🔥 NEW: Requests
        long totalRequests = requestRepo.count();
        long pendingRequests = requestRepo.countByRequestStatus(RequestStatus.PENDING);
        long approvedRequests = requestRepo.countByRequestStatus(RequestStatus.APPROVED);

        // 🔥 NEW: Issues
        long issuedCount = issueRepo.count();

        // ================= ADD TO RESPONSE =================
        data.put("totalDonors", totalDonors);
        data.put("pendingDonors", pendingDonors);
        data.put("totalHospitals", totalHospitals);
        data.put("totalUnits", totalUnits);

        data.put("totalRequests", totalRequests);
        data.put("pendingRequests", pendingRequests);
        data.put("approvedRequests", approvedRequests);
        data.put("issuedCount", issuedCount);

        return data;
    }

    // ================= BAR CHART =================
    @GetMapping("/inventory-by-group")
    public List<Map<String, Object>> getInventoryByGroup() {

        List<Object[]> result = inventoryRepo.getUnitsByBloodGroup();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> item = new HashMap<>();
            item.put("groupName", row[0]);
            item.put("units", row[1]);
            response.add(item);
        }

        return response;
    }

    // ================= PIE CHART =================
    @GetMapping("/donor-status")
    public List<Map<String, Object>> getDonorStatus() {

        List<Map<String, Object>> data = new ArrayList<>();

        long active = donorRepo.countByStatus(DonorStatus.ACTIVE);
        long pending = donorRepo.countByStatus(DonorStatus.PENDING_VERIFICATION);

        data.add(Map.of("name", "Active", "value", active));
        data.add(Map.of("name", "Pending", "value", pending));

        return data;
    }
}