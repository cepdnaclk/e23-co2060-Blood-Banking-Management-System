package com.bbms.backend.Repository;

import com.bbms.backend.entity.BloodRequest;
import com.bbms.backend.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByRequestStatus(RequestStatus status);

    List<BloodRequest> findByHospitalId(Long hospitalId);
    long countByRequestStatus(RequestStatus status);
}
