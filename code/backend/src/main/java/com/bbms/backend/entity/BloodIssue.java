package com.bbms.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "blood_issues")
public class BloodIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long issueId;

    private String bloodGroup;

    @Enumerated(EnumType.STRING)
    private BloodComponent.ComponentType componentType;

    private String hospitalName;

    private LocalDate issueDate;

    private Double quantity;

    private Long requestId;

    // AUTO DATE
    @PrePersist
    protected void onCreate() {
        this.issueDate = LocalDate.now();
    }

    // GETTERS & SETTERS
    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public BloodComponent.ComponentType getComponentType() { return componentType; }
    public void setComponentType(BloodComponent.ComponentType componentType) {
        this.componentType = componentType;
    }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }
}