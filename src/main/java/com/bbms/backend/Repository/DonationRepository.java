package com.bbms.backend.Repository;

import com.bbms.backend.entity.Donation;
import com.bbms.backend.entity.DonationStatus;
import com.bbms.backend.entity.DonorScreening;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository
        extends JpaRepository<Donation, Long> {

    boolean existsByScreening(DonorScreening screening);

    List<Donation> findByDonationStatus(
            DonationStatus donationStatus
    );
}