package com.bbms.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "blood_components")
public class BloodComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long componentId;

    // 🔗 Proper relationship (NOT just donationId)
    @ManyToOne
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @Enumerated(EnumType.STRING)
    private ComponentType componentType;

    private Double quantity;

    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.AVAILABLE;

    public enum ComponentType {
        WHOLE_BLOOD,
        RBC,
        PLASMA,
        PLATELETS,
        CRYOPRECIPITATE
    }

    public enum Status {
        AVAILABLE,
        USED,
        DISCARDED,
        EXPIRED
    }

    // Getters & Setters
    public Long getComponentId() { return componentId; }
    public void setComponentId(Long componentId) { this.componentId = componentId; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public ComponentType getComponentType() { return componentType; }
    public void setComponentType(ComponentType componentType) { this.componentType = componentType; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getBloodGroup() {
        if (donation != null && donation.getDonor() != null) {
            return donation.getDonor().getBloodGroup().name();
        }
        return null;
    }



}