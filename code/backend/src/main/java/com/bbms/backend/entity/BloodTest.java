package com.bbms.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "blood_tests")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BloodTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_id")
    private Long testId;

    // ✅ Safe relation (no infinite loop / 500 error)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donation_id", nullable = false)
    @JsonIgnoreProperties({
            "donor",
            "screening",
            "hibernateLazyInitializer",
            "handler"
    })
    private Donation donation;

    @Enumerated(EnumType.STRING)
    private TestResultStatus hiv;

    @Column(name = "hepatitis_b")
    @Enumerated(EnumType.STRING)
    private TestResultStatus hepatitisB;

    @Column(name = "hepatitis_c")
    @Enumerated(EnumType.STRING)
    private TestResultStatus hepatitisC;

    @Enumerated(EnumType.STRING)
    private TestResultStatus malaria;

    @Enumerated(EnumType.STRING)
    private TestResultStatus syphilis;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_result", nullable = false)
    private OverallBloodTestStatus overallResult = OverallBloodTestStatus.PENDING;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "test_date")
    private LocalDate testDate;

    private String remarks;

    public BloodTest() {}

    // ✅ Auto set date
    @PrePersist
    protected void onCreate() {
        this.testDate = LocalDate.now();
    }

    // ✅ VERY IMPORTANT for frontend
    public Long getDonationId() {
        return donation != null ? donation.getDonationId() : null;
    }

    // ================= GETTERS & SETTERS =================

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public TestResultStatus getHiv() {
        return hiv;
    }

    public void setHiv(TestResultStatus hiv) {
        this.hiv = hiv;
    }

    public TestResultStatus getHepatitisB() {
        return hepatitisB;
    }

    public void setHepatitisB(TestResultStatus hepatitisB) {
        this.hepatitisB = hepatitisB;
    }

    public TestResultStatus getHepatitisC() {
        return hepatitisC;
    }

    public void setHepatitisC(TestResultStatus hepatitisC) {
        this.hepatitisC = hepatitisC;
    }

    public TestResultStatus getMalaria() {
        return malaria;
    }

    public void setMalaria(TestResultStatus malaria) {
        this.malaria = malaria;
    }

    public TestResultStatus getSyphilis() {
        return syphilis;
    }

    public void setSyphilis(TestResultStatus syphilis) {
        this.syphilis = syphilis;
    }

    public OverallBloodTestStatus getOverallResult() {
        return overallResult;
    }

    public void setOverallResult(OverallBloodTestStatus overallResult) {
        this.overallResult = overallResult;
    }

    public LocalDate getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDate testDate) {
        this.testDate = testDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}