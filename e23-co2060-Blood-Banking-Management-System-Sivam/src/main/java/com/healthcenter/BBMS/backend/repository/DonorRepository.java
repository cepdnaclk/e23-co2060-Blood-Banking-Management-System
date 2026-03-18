package com.healthcenter.BBMS.backend.repository;

import com.healthcenter.BBMS.backend.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import com.healthcenter.BBMS.backend.entity.BloodGroup;
@Repository

public interface DonorRepository extends JpaRepository<Donor,Long>{
    Optional<Donor> findByNic(String nic);

    Optional<Donor> findByEmail(String email);
    List<Donor> findByStatus(String status);
    List<Donor> findByBloodGroup(BloodGroup bloodGroup);
}
