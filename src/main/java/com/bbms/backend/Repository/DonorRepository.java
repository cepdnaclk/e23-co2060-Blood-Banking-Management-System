package com.bbms.backend.Repository;

import com.bbms.backend.entity.Donor;
import com.bbms.backend.entity.DonorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByNic(String nic);

    Optional<Donor> findByEmail(String email);

    List<Donor> findByStatus(DonorStatus status);
}
