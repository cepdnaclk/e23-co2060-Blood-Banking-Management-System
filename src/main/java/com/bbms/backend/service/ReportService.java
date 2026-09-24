package com.bbms.backend.service;

import com.bbms.backend.Repository.AlertRepository;
import com.bbms.backend.Repository.BloodComponentRepository;
import com.bbms.backend.Repository.BloodRequestRepository;
import com.bbms.backend.Repository.BloodTestRepository;
import com.bbms.backend.Repository.DonationRepository;
import com.bbms.backend.Repository.DonorRepository;
import com.bbms.backend.Repository.InventoryRepository;

import com.bbms.backend.dto.ReportResponse;
import com.bbms.backend.entity.AlertStatus;
import com.bbms.backend.entity.DonationStatus;
import com.bbms.backend.entity.DonorStatus;
import com.bbms.backend.entity.OverallBloodTestStatus;
import com.bbms.backend.entity.RequestStatus;

import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final DonorRepository donorRepository;
    private final DonationRepository donationRepository;
    private final BloodTestRepository bloodTestRepository;
    private final BloodComponentRepository bloodComponentRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final InventoryRepository inventoryRepository;
    private final AlertRepository alertRepository;

    public ReportService(
            DonorRepository donorRepository,
            DonationRepository donationRepository,
            BloodTestRepository bloodTestRepository,
            BloodComponentRepository bloodComponentRepository,
            BloodRequestRepository bloodRequestRepository,
            InventoryRepository inventoryRepository,
            AlertRepository alertRepository) {

        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
        this.bloodTestRepository = bloodTestRepository;
        this.bloodComponentRepository = bloodComponentRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.inventoryRepository = inventoryRepository;
        this.alertRepository = alertRepository;
    }

    public ReportResponse generateReport() {

        ReportResponse report = new ReportResponse();

        // ================= DONORS =================

        long totalDonors =
                donorRepository.count();

        long activeDonors =
                donorRepository.findAll()
                        .stream()
                        .filter(d ->
                                d.getStatus() == DonorStatus.ACTIVE)
                        .count();

        report.setTotalDonors(totalDonors);
        report.setActiveDonors(activeDonors);


        // ================= DONATIONS =================

        long totalDonations =
                donationRepository.count();

        long completedDonations =
                donationRepository.findAll()
                        .stream()
                        .filter(d ->
                                d.getDonationStatus()
                                        == DonationStatus.COMPLETED)
                        .count();

        report.setTotalDonations(totalDonations);
        report.setCompletedDonations(completedDonations);


        // ================= BLOOD TESTS =================

        long totalBloodTests =
                bloodTestRepository.count();

        long safeBloodTests =
                bloodTestRepository.findAll()
                        .stream()
                        .filter(t ->
                                t.getOverallResult()
                                        == OverallBloodTestStatus.SAFE)
                        .count();

        long unsafeBloodTests =
                bloodTestRepository.findAll()
                        .stream()
                        .filter(t ->
                                t.getOverallResult()
                                        == OverallBloodTestStatus.UNSAFE)
                        .count();

        long pendingBloodTests =
                bloodTestRepository.findAll()
                        .stream()
                        .filter(t ->
                                t.getOverallResult()
                                        == OverallBloodTestStatus.PENDING)
                        .count();

        report.setTotalBloodTests(totalBloodTests);
        report.setSafeBloodTests(safeBloodTests);
        report.setUnsafeBloodTests(unsafeBloodTests);
        report.setPendingBloodTests(pendingBloodTests);


        // ================= BLOOD COMPONENTS =================

        long totalComponents =
                bloodComponentRepository.count();

        report.setTotalComponents(totalComponents);


        // ================= BLOOD REQUESTS =================

        long totalRequests =
                bloodRequestRepository.count();

        long pendingRequests =
                bloodRequestRepository.findAll()
                        .stream()
                        .filter(r ->
                                r.getRequestStatus()
                                        == RequestStatus.PENDING)
                        .count();

        long approvedRequests =
                bloodRequestRepository.findAll()
                        .stream()
                        .filter(r ->
                                r.getRequestStatus()
                                        == RequestStatus.APPROVED)
                        .count();

        long rejectedRequests =
                bloodRequestRepository.findAll()
                        .stream()
                        .filter(r ->
                                r.getRequestStatus()
                                        == RequestStatus.REJECTED)
                        .count();

        report.setTotalRequests(totalRequests);
        report.setPendingRequests(pendingRequests);
        report.setApprovedRequests(approvedRequests);
        report.setRejectedRequests(rejectedRequests);


        // ================= INVENTORY =================

        double totalInventoryQuantity =
                inventoryRepository.findAll()
                        .stream()
                        .filter(i -> i.getQuantity() != null)
                        .mapToDouble(i ->
                                i.getQuantity())
                        .sum();

        report.setTotalInventoryQuantity(
                totalInventoryQuantity);


        // ================= ALERTS =================

        long activeAlerts =
                alertRepository.findByStatus(
                                AlertStatus.ACTIVE)
                        .size();

        report.setActiveAlerts(activeAlerts);


        return report;
    }
}