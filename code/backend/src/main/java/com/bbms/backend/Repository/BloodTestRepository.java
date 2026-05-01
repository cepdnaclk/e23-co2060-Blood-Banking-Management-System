package com.bbms.backend.Repository;

import com.bbms.backend.entity.BloodTest;
import com.bbms.backend.entity.Donation;
import com.bbms.backend.entity.OverallBloodTestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodTestRepository extends JpaRepository<BloodTest, Long> {

    boolean existsByDonation(Donation donation);

    List<BloodTest> findByDonation(Donation donation);
    List<BloodTest> findByOverallResult(OverallBloodTestStatus status);
}