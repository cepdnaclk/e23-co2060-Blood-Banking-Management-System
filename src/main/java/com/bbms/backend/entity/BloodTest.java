package com.bbms.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "blood_tests")
public class BloodTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    @Column(nullable = false)
    private Long donationId;

    @Enumerated(EnumType.STRING)
    private Result overallResult;

    public enum Result {
        SAFE,
        UNSAFE,
        PENDING
    }

    // Getters & Setters

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public Result getOverallResult() {
        return overallResult;
    }

    public void setOverallResult(Result overallResult) {
        this.overallResult = overallResult;
    }
}
