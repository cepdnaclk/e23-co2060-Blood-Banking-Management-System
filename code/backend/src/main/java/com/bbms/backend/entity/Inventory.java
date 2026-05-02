package com.bbms.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    private Long componentId;

    private Long donationId;

    private String bloodGroup;

    @Enumerated(EnumType.STRING)
    private BloodComponent.ComponentType componentType;

    private Double quantity;

    private Double reorderLevel = 5.0;

    private String stockStatus;

    private String storageLocation;

    // 🔥 STATUS LOGIC
    public void updateStockStatus() {
        if (quantity == null || quantity <= 0) {
            stockStatus = "OUT_OF_STOCK";
        } else if (quantity < reorderLevel) {
            stockStatus = "LOW_STOCK";
        } else {
            stockStatus = "AVAILABLE";
        }
    }

    // ✅ GETTERS & SETTERS

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public Long getComponentId() {
        return componentId;
    }

    public void setComponentId(Long componentId) {
        this.componentId = componentId;
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public BloodComponent.ComponentType getComponentType() {
        return componentType;
    }

    public void setComponentType(BloodComponent.ComponentType componentType) {
        this.componentType = componentType;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Double reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getStockStatus() {
        return stockStatus;
    }

    public void setStockStatus(String stockStatus) {
        this.stockStatus = stockStatus;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }
}