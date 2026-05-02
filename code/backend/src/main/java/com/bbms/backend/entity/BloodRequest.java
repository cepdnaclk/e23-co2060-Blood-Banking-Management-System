package com.bbms.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospital_requests")
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(name = "hospital_id")
    private Long hospitalId;

    @Column(name = "requested_by")
    private Long requestedBy;

    private String patientName;

    private String bloodGroup;

    @Enumerated(EnumType.STRING)
    private BloodComponent.ComponentType componentType;

    @Column(name = "units_required")
    private Double unitsRequired;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgencyLevel;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_status")
    private RequestStatus requestStatus = RequestStatus.PENDING;

    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 🔥 AUTO SET DATES
    @PrePersist
    public void onCreate() {
        this.requestDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
    }

    // ===== GETTERS & SETTERS =====

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public Long getRequestedBy() { return requestedBy; }
    public void setRequestedBy(Long requestedBy) { this.requestedBy = requestedBy; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public BloodComponent.ComponentType getComponentType() { return componentType; }
    public void setComponentType(BloodComponent.ComponentType componentType) { this.componentType = componentType; }

    public Double getUnitsRequired() { return unitsRequired; }
    public void setUnitsRequired(Double unitsRequired) { this.unitsRequired = unitsRequired; }

    public UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }

    public RequestStatus getRequestStatus() { return requestStatus; }
    public void setRequestStatus(RequestStatus requestStatus) { this.requestStatus = requestStatus; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}