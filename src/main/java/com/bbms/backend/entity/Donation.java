package com.bbms.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId;

    // Link to donor
    @Column(nullable = false)
    private Long donorId;

    // Link to screening
    private Long screeningId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate donationDate;

    @Column(nullable = false)
    private Double unitsCollected;

    // Default status
    @Enumerated(EnumType.STRING)
    private DonationStatus donationStatus = DonationStatus.COMPLETED;

    private String remarks;

    //Enum inside entity
    public enum DonationStatus {
        COMPLETED,
        CANCELLED,
        FAILED
    }

    //Getters and Setters

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public Long getScreeningId() {
        return screeningId;
    }

    public void setScreeningId(Long screeningId) {
        this.screeningId = screeningId;
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDate donationDate) {
        this.donationDate = donationDate;
    }

    public Double getUnitsCollected() {
        return unitsCollected;
    }

    public void setUnitsCollected(Double unitsCollected) {
        this.unitsCollected = unitsCollected;
    }

    public DonationStatus getDonationStatus() {
        return donationStatus;
    }

    public void setDonationStatus(DonationStatus donationStatus) {
        this.donationStatus = donationStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
