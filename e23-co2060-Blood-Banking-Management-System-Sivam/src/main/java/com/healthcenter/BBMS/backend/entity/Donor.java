package com.healthcenter.BBMS.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

//donorId ( primary key)
//fullname
//nic
//dob
//gender
//weight
//bloodGroup
//phone
//email
//address
//lastDonationDate
//status
//created_at
@Entity
@Table(name = "donors")
public class Donor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long donorId;

    private String fullname;

    @Column(unique = true)
    private String nic;

    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Double weight;

    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;

    private String phone;

    @Column(unique = true)
    private String email;
    private String address;
    private LocalDate lastDonationDate;

    private String status;
    private LocalDateTime createdAt;

    //Getter and setter methods
    public Donor() {}
    public long getDonorId() {
        return donorId;
    }
    public void setDonorId(long donorId) {
        this.donorId = donorId;
    }
    public String getFullname() {
        return fullname;
    }
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    public String getNic() {
        return nic;
    }
    public void setNic(String nic) {
        this.nic = nic;
    }
    public LocalDate getDob() {
        return dob;
    }
    public void setDob(LocalDate dob) {
        this.dob = dob;
    }
    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }
    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
