package com.healthcenter.BBMS.backend.repository;

import com.healthcenter.BBMS.backend.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor,Long>{
    Optional<Donor> findByNic(String nic);

    Optional<Donor> findByEmail(String email);

}
