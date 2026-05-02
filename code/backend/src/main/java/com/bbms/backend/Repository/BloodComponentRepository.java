package com.bbms.backend.Repository;

import com.bbms.backend.entity.BloodComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodComponentRepository extends JpaRepository<BloodComponent, Long> {

    List<BloodComponent> findByDonation_DonationId(Long donationId);

    boolean existsByDonation_DonationId(Long donationId);
}