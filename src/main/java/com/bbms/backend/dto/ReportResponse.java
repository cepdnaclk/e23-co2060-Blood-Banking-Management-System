package com.bbms.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportResponse {

    // Donor statistics
    private long totalDonors;
    private long activeDonors;

    // Donation statistics
    private long totalDonations;
    private long completedDonations;

    // Blood test statistics
    private long totalBloodTests;
    private long safeBloodTests;
    private long unsafeBloodTests;
    private long pendingBloodTests;

    // Blood component statistics
    private long totalComponents;

    // Blood request statistics
    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;

    // Inventory statistics
    private double totalInventoryQuantity;

    // Alert statistics
    private long activeAlerts;
}