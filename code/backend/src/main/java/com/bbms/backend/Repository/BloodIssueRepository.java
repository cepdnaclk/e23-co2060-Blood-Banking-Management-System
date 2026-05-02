package com.bbms.backend.Repository;

import com.bbms.backend.entity.BloodIssue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodIssueRepository extends JpaRepository<BloodIssue, Long> {

    List<BloodIssue> findByRequestId(Long requestId);
}