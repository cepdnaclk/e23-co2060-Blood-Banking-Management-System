package com.bbms.backend.Repository;

import com.bbms.backend.entity.BloodIssue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodIssueRepository extends JpaRepository<BloodIssue, Long> {
}
